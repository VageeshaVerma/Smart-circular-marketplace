# backend/app/ai_sim.py
import joblib
import os
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__),  "ml", "models", "price_model.pkl")
data = joblib.load(MODEL_PATH)
model = data["model"]
le_condition = data["le_condition"]
le_category = data["le_category"]

def predict_price(age: int, condition: str, category: str):
    try:
        condition_enc = le_condition.transform([condition])[0]
    except ValueError:
        condition_enc = 0  # fallback
    try:
        category_enc = le_category.transform([category])[0]
    except ValueError:
        category_enc = 0  # fallback

    input_df = pd.DataFrame([{
        "age": age,
        "condition_enc": condition_enc,
        "category_enc": category_enc
    }])

    predicted_price = model.predict(input_df)[0]

    # Action recommendation
    if predicted_price > 8000:
        recommendation = "Resell"
    elif predicted_price > 3000:
        recommendation = "Repair & Resell"
    else:
        recommendation = "Recycle"

    return {
        "predicted_price": round(float(predicted_price), 2),
        "recommendation": recommendation
    }
