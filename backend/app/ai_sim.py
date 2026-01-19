# backend/app/ai_sim.py
import joblib
import os
import pandas as pd
from .ml.rules import decide_action

# Load the trained model and encoders
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "models", "price_model.pkl")
bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
le_condition = bundle["le_condition"]
le_category = bundle["le_category"]

def predict_product_decision(
    title: str, 
    category: str,
    price: float,
    condition: str,
    age: int,
    co2_kg: float
):
    """
    Predict resale value and suggest action (Resell, Repair, Recycle) 
    using the trained RandomForest model and decision rules.
    """
    # Normalize category and condition for consistency
    condition_norm = condition.capitalize()  # Good -> Good
    category_norm = category.capitalize()    # electronics -> Electronics

    # Encode categorical features
    try:
        condition_enc = le_condition.transform([condition_norm])[0]
    except ValueError:
        condition_enc = 0  # fallback for unseen category

    try:
        category_enc = le_category.transform([category_norm])[0]
    except ValueError:
        category_enc = 0  # fallback for unseen category

    # Prepare input as pandas DataFrame (fixes sklearn warning)
    FEATURES = ["price", "age", "condition_enc", "category_enc"]
    X = pd.DataFrame([[price, age, condition_enc, category_enc]], columns=FEATURES)

    # Predict resale value
    predicted_resale = float(model.predict(X)[0])

    # Decide action using rules.py
    action = decide_action(
        predicted_resale_value=predicted_resale,
        original_price=price,
        condition=condition_norm,
        age=age,
        category=category_norm
    )

    # Estimate CO2 saved
    co2_saved = round(co2_kg * 0.7, 2)

    # Return unified response
    return {
        "predicted_resale_value": round(predicted_resale, 2),
        "recommendation": action,
        "co2_saved_estimate": co2_saved
    }
