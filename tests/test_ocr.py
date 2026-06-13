from app.services.extraction.ocr_service import (
    extract_text_from_pdf
)

pdf_path = "tests/sample_invoice.pdf"

text = extract_text_from_pdf(pdf_path)

print("Extracted Text:")
print(text[:1000])