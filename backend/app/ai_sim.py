import joblib
import os
import pandas as pd

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "ml",
    "models",
    "price_model.pkl"
)

model = joblib.load(MODEL_PATH)

def predict_price(age: int, condition: str, category: str):
    input_df = pd.DataFrame([{
        "age": age,
        "condition": condition,
        "category": category
    }])

    predicted_price = model.predict(input_df)[0]

    # Recommendation logic
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
