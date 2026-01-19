# backend/app/ml/train_model.py
import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

BASE_DIR = os.path.dirname(__file__)
CSV_FILE = os.path.join(BASE_DIR, "product_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "price_model.pkl")

# Load dataset
df = pd.read_csv(CSV_FILE)

# Encode categorical features
le_condition = LabelEncoder()
le_category = LabelEncoder()

df["condition_enc"] = le_condition.fit_transform(df["condition"])
df["category_enc"] = le_category.fit_transform(df["category"])

# Features & target
FEATURES = ["price", "age", "condition_enc", "category_enc"]
X = df[FEATURES]
y = df["resale_value"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)
model.fit(X_train, y_train)

# Save model + encoders + feature order
joblib.dump(
    {
        "model": model,
        "le_condition": le_condition,
        "le_category": le_category,
        "features": FEATURES
    },
    MODEL_PATH
)

print(f"✅ Resale value model trained & saved at {MODEL_PATH}")
