UNIFIED_DOCUMENT_SCHEMA = """
Return ONLY valid JSON.

{
    "document_type": "",
    "vendor_name": "",
    "document_number": "",
    "document_date": "",

    "currency": "",

    "subtotal": 0,
    "tax": 0,
    "total_amount": 0,

    "line_items": [
        {
            "item_code": "",
            "description": "",
            "quantity": 0,
            "unit_price": 0,
            "total_price": 0
        }
    ]
}

Rules:

- Return ONLY JSON
- No markdown
- No explanations
- No comments

- Missing values → null
- Numeric fields must be numeric
- line_items must always be a list
- currency should be INR, USD, EUR etc

- document_type must be:
  invoice
  purchase_order
  grn
"""



DOCUMENT_EXTRACTION_PROMPT = f"""
You are an expert financial document extraction system.

Your task is to extract structured information
from OCR text.

{UNIFIED_DOCUMENT_SCHEMA}

Important:

1. Return ONLY valid JSON.
2. Do not wrap response in markdown.
3. Do not add explanations.
4. If information is missing, use null.
5. Preserve numeric values accurately.

OCR TEXT:

<<OCR_TEXT>>
"""



# DOCUMENT_EXTRACTION_PROMPT = f"""
# You are an expert financial document extraction system.

# Your task is to extract structured information
# from OCR text.

# {UNIFIED_DOCUMENT_SCHEMA}

# Important:

# 1. Return ONLY valid JSON.
# 2. Do not wrap response in markdown.
# 3. Do not add explanations.
# 4. If information is missing, use null.
# 5. Preserve numeric values accurately.

# OCR TEXT:

# {{ocr_text}}
# """