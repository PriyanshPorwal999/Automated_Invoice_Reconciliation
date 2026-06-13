from pathlib import Path

from app.services.extraction.extraction_service import (
    extract_document_data
)

pdf_path = (
    Path(__file__).parent
    / "sample_invoice.pdf"
)

result = extract_document_data(
    str(pdf_path)
)

print(result)