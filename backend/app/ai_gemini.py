# backend/app/ai_gemini.py
import os
from google import genai

# Make sure you set your environment variable: GENAI_API_KEY
api_key = os.getenv("GOOGLE_API_KEY")

def get_gemini_recommendation(prompt: str) -> str:
    try:
        # Directly call the `genai.chat.completions.create()` for text generation
        response = genai.chat.completions.create(
            model="gemini-2.5",
            messages=[{"role": "user", "content": prompt}],
            api_key=api_key
        )
        # Extract the AI's reply
        return response.choices[0].content[0].text.strip()
    except Exception as e:
        print("Gemini API error:", e)
        return "AI suggestion unavailable at the moment."
