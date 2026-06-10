import os
import re
import json
from typing import Optional
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

# ── Initialize the LLM (Groq + Llama 3) ──
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    temperature=0
)


# ── Shared helper: strip markdown fences and parse JSON safely ──
def _parse_json_response(text: str) -> Optional[dict]:
    """
    Robustly extract JSON from LLM response.
    Handles markdown fences, escaped newlines, and leading prose.
    """
    try:
        # 1. Remove markdown code fences
        text = re.sub(r"```json|```", "", text).strip()

        # 2. Replace both forms of escaped newlines/tabs
        text = text.replace("\\n", " ").replace("\\t", " ")
        # Also replace actual newlines inside the JSON block
        # (keep structure by only collapsing whitespace, not removing braces)

        # 3. Find outermost JSON object boundaries
        start = text.find("{")
        end = text.rfind("}") + 1

        if start == -1 or end == 0:
            return None

        json_str = text[start:end]

        # 4. Try direct parse first
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass

        # 5. Fallback: remove all actual newline/tab characters and retry
        json_str_clean = re.sub(r'[\n\r\t]', ' ', json_str)
        return json.loads(json_str_clean)

    except Exception as e:
        print("JSON Parse Error:", str(e))
        print("Raw text was:", text[:300])
        return None


# ════════════════════════════════════════
# AGENT 1 — PARSER
# Takes raw OCR text → returns structured data
# ════════════════════════════════════════
def agent_parser(raw_text: str, doc_type: str) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a document parser for financial documents.

Extract structured information from the raw OCR text provided.

IMPORTANT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text
- vendor_name = seller/company issuing the invoice,
  NOT customer/billing person name.

Return ONLY a valid JSON object with these fields:

{{
  "vendor_name": "company or person name",
  "doc_id": "invoice/receipt/order number",
  "date": "date on document",
  "total_amount": 0.00,
  "line_items": [
    {{
      "description": "item name",
      "quantity": 1,
      "unit_price": 0.00,
      "total": 0.00
    }}
  ],
  "tax": 0.00,
  "currency": "INR or USD etc"
}}

Rules:
- If field missing → use null
- quantity must be numeric
- prices must be numeric
- tax must be numeric
- total_amount must be numeric
- currency should be INR, USD, EUR etc
- line_items should always be a list

Return only JSON."""),

        ("human",
         "Document type: {doc_type}\n\nRaw text:\n{raw_text}")
    ])

    chain = prompt | llm

    response = chain.invoke({
        "doc_type": doc_type,
        "raw_text": raw_text
    })

    parsed = _parse_json_response(response.content)
    if parsed is not None:
        return parsed

    return {
        "error": "Could not parse document",
        "raw_response": response.content
    }


# ════════════════════════════════════════
# AGENT 2 — AUDITOR
# Takes structured data → finds defects
# ════════════════════════════════════════
def agent_auditor(
        extracted_data: dict,
        doc_type: str,
        past_defect_count: int
) -> dict:

    # ── Guard: refuse to audit failed parse ──
    if "error" in extracted_data:
        return {
            "status": "defective",
            "defect_count": 1,
            "defects": [{
                "type": "parse failure",
                "description":
                "Document could not be parsed. Raw OCR may be unreadable or wrong file type."
            }],
            "remarks": extracted_data.get(
                "raw_response",
                "No additional detail."
            )
        }

    extracted_json_str = json.dumps(
        extracted_data,
        ensure_ascii=False
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a financial auditor.

Analyze the document data and check for:

1. Price mismatches
(unit price x quantity != line total)

2. Missing required fields
(vendor name, date, total amount, doc ID)

3. Tax calculation errors

4. Duplicate or suspicious entries

5. Unreasonable amounts

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text

Return this format exactly:

{{
  "status": "clean",
  "defect_count": 0,
  "defects": [
    {{
      "type": "defect type",
      "description": "what is wrong"
    }}
  ],
  "remarks": "overall summary"
}}

Rules:
- status values: "clean", "defective", "critical"
- If past_defect_count >= 3 then status MUST be "critical"
- If no issues found: status = "clean", defect_count = 0, defects = []

Return only JSON."""),

        ("human",
         "Document data:\n{extracted_data}\n\n"
         "Document type: {doc_type}\n"
         "Past defects from this vendor: {past_defect_count}")
    ])

    chain = prompt | llm

    response = chain.invoke({
        "extracted_data": extracted_json_str,
        "doc_type": doc_type,
        "past_defect_count": past_defect_count
    })

    parsed = _parse_json_response(response.content)

    if parsed is not None:
        return parsed

    return {
        "status": "defective",
        "defect_count": 1,
        "defects": [{
            "type": "parse error",
            "description": "Could not analyze document"
        }],
        "remarks": response.content
    }


# ════════════════════════════════════════
# AGENT 3 — ADVISOR
# Takes audit result → suggests email action
# ════════════════════════════════════════
def agent_advisor(
        audit_result: dict,
        vendor_name: str,
        past_defect_count: int
) -> dict:

    audit_json_str = json.dumps(
        audit_result,
        ensure_ascii=False
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a financial communication advisor.

Based on the audit result, suggest the correct action and draft an email.

Rules:
- If status = "clean" then action = "release_payment"
- If status = "defective" then action = "formal_remarks"
- If status = "critical" OR past_defect_count >= 3 then action = "last_warning"

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text

Return format:

{{
  "action": "release_payment",
  "email_subject": "subject line here",
  "email_body": "full email body here",
  "reasoning": "why this action was chosen"
}}

Valid action values: "release_payment", "formal_remarks", "last_warning"

Return only JSON."""),

        ("human",
         "Vendor: {vendor_name}\n"
         "Past defect count: {past_defect_count}\n"
         "Audit result:\n{audit_result}")
    ])

    chain = prompt | llm

    response = chain.invoke({
        "vendor_name": vendor_name,
        "past_defect_count": past_defect_count,
        "audit_result": audit_json_str
    })

    parsed = _parse_json_response(response.content)

    if parsed is not None:
        return parsed

    return {
        "action": "formal_remarks",
        "email_subject": "Audit Review Required",
        "email_body": "Please review the attached audit findings.",
        "reasoning": "Default due to processing error"
    }