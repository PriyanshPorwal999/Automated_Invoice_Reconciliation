from app.services.extraction.gemini_service import (
    extract_structured_data
)

prompt = """
Return ONLY valid JSON.

{
    "message": "hello"
}
"""

result = extract_structured_data(
    prompt
)

print(result)