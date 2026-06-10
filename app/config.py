import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")

MAX_FILE_SIZE_MB = int(
    os.getenv("MAX_FILE_SIZE_MB", 10)
)

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)