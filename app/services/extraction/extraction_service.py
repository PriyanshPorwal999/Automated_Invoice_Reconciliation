from app.services.extraction.ocr_service import (
    extract_text_from_pdf
)

from app.services.extraction.gemini_service import (
    extract_structured_data
)

from app.prompts.invoice_extraction_prompt import (
    DOCUMENT_EXTRACTION_PROMPT
)


def extract_document_data(
    pdf_path: str
) -> dict:
    """
    End-to-end extraction pipeline.

    PDF
      ↓
    OCR/Text Extraction
      ↓
    Gemini
      ↓
    Structured JSON
    """

    try:

        raw_text = extract_text_from_pdf(
            pdf_path
        )

        prompt = DOCUMENT_EXTRACTION_PROMPT.replace(
            "<<OCR_TEXT>>",
            raw_text
        )

        # prompt = DOCUMENT_EXTRACTION_PROMPT.format(
        #     ocr_text=raw_text
        # )

        structured_data = (
            extract_structured_data(prompt)
        )

        return {
            "status": "success",
            "data": structured_data
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }