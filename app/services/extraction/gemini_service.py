import json

import google.generativeai as genai


from app.config import GEMINI_API_KEY


# Configure Gemini
genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def extract_structured_data(
    prompt: str
) -> dict:
    """
    Send prompt to Gemini and return JSON.
    """

    try:

        response = model.generate_content(
            prompt
        )

        response_text = response.text.strip()

        # Remove markdown fences if Gemini adds them
        response_text = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(
            response_text
        )

    except Exception as e:

        raise Exception(
            f"Gemini extraction failed: {str(e)}"
        )