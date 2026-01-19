import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyAs-3IH80oGlwN_xboATzODkxmBAbP60UI"
)

model = genai.GenerativeModel("models/gemini-2.5-flash")

def get_gemini_recommendation(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini API error:", e)
        return "AI suggestion unavailable at the moment."
