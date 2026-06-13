import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF using PyMuPDF.

    Args:
        pdf_path (str): Path to PDF file.

    Returns:
        str: Extracted text.
    """

    try:
        document = fitz.open(pdf_path)

        extracted_text = []

        # with fitz.open(pdf_path) as document:

        for page in document:
            extracted_text.append(page.get_text())

        document.close()

        return "\n".join(extracted_text).strip()

    except Exception as e:
        raise Exception(
            f"PDF text extraction failed: {str(e)}"
        )