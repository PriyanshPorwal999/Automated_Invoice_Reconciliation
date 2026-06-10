import pytesseract
from PIL import Image
import pdf2image
import os
from dotenv import load_dotenv

load_dotenv()

# Tell pytesseract where Tesseract is installed
pytesseract.pytesseract.tesseract_cmd = os.getenv(
    "TESSERACT_PATH",
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# Poppler path for pdf2image (Windows requires this)
POPPLER_PATH = os.getenv(
    "POPPLER_PATH",
    r"C:\poppler\Library\bin"   # change this to match your installation
)

def extract_text_from_image(image_path: str) -> str:
    """Extract text from a single image file (jpg, png etc)"""
    try:
        img  = Image.open(image_path)
        text = pytesseract.image_to_string(img, config='--oem 3 --psm 6')
        return text.strip()
    except Exception as e:
        return f"OCR Error: {str(e)}"

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF by converting each page to image first"""
    try:
        # Pass poppler_path explicitly so it works on Windows without PATH setup
        pages = pdf2image.convert_from_path(
            pdf_path,
            dpi=200,
            poppler_path=POPPLER_PATH if os.path.isdir(POPPLER_PATH) else None
        )
        full_text = ""
        for i, page in enumerate(pages):
            text       = pytesseract.image_to_string(page, config='--oem 3 --psm 6')
            full_text += f"\n--- Page {i+1} ---\n{text}"
        return full_text.strip()
    except Exception as e:
        return f"PDF OCR Error: {str(e)}"

def extract_text(file_path: str) -> str:
    """
    Main function — detects file type automatically
    and calls the right extractor
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
        return extract_text_from_image(file_path)
    else:
        return "Unsupported file type. Please upload a PDF or image."