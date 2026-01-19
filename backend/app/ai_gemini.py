import google.genai as genai
import os

API_KEY = os.getenv("GENAI_API_KEY")
model = genai.TextGenerationModel.from_pretrained(
    "models/gemini-2.5-flash",
    api_key=API_KEY
)


def get_gemini_recommendation(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini API error:", e)
        return "AI suggestion unavailable at the moment."
