import joblib
import os
import numpy as np
from .rules import decide_action

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "models",
    "price_model.pkl"
)

bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
le_condition = bundle["le_condition"]
le_category = bundle["le_category"]



def predict_product_decision(
    
    category: str,
    price: float,
    condition: str,
    age: int,
    co2_kg: float
):
    condition_norm = condition.capitalize()  # Good -> Good
    category_norm = category.capitalize()    # electronics -> Electronics

    # Encode inputs
    try:
        condition_enc = le_condition.transform([condition_norm])[0]
    except ValueError:
        condition_enc = 0  # fallback

    try:
        category_enc = le_category.transform([category_norm])[0]
    except ValueError:
        category_enc = 0  # fallback

    X = np.array([[price, age, condition_enc, category_enc]])

    # Predict resale value
    predicted_resale = float(model.predict(X)[0])

    # Decide action
    action = decide_action(
        predicted_resale_value=predicted_resale,
        original_price=price,
        condition=condition_norm,
        age=age,
        category=category_norm
    )

    return {
        "predicted_price": round(predicted_resale, 2),
        "recommendation": action,
        "co2_saved_estimate": round(co2_kg * 0.7, 2)
    }
