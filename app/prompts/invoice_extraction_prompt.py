UNIFIED_DOCUMENT_SCHEMA = """
{
    "document_type": "",
    "document_number": "",
    "reference_po_number": "",
    "reference_invoice_number": "",
    "document_date": "",


    "vendor_name": "",
    "buyer_name": "",

    "currency": "",

    "subtotal": 0,

    "cgst": 0,
    "sgst": 0,
    "igst": 0,

    "tax": 0,

    "total_amount": 0,

    "line_items": [
        {
            "description": "",
            "quantity": 0,
            "unit_price": 0,
            "total_price": 0
        }
    ]
}

Important:

For INVOICE:
Extract PO reference number if mentioned.

For GRN:
Extract PO reference number and
Invoice reference number if mentioned.

Examples:

PO:
PO-JS-2024-0051

Invoice:
Against PO: PO-JS-2024-0051

GRN:
Against PO: PO-JS-2024-0051
Against Invoice: INV-RE-2024-0189


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




# UNIFIED_DOCUMENT_SCHEMA = 
# Return ONLY valid JSON.

# {
#     "document_type": "",
#     "vendor_name": "",
#     "document_number": "",
#     "document_date": "",

#     "currency": "",

#     "subtotal": 0,
#     "tax": 0,
#     "total_amount": 0,

#     "line_items": [
#         {
#             "item_code": "",
#             "description": "",
#             "quantity": 0,
#             "unit_price": 0,
#             "total_price": 0
#         }
#     ]
# }



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