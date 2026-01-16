# backend/app/ml/train_model.py
import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

CSV_FILE = os.path.join(os.path.dirname(__file__), "product_data.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
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
X = df[["age", "condition_enc", "category_enc"]]
y = df["resale_value"]

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model + encoders
joblib.dump({
    "model": model,
    "le_condition": le_condition,
    "le_category": le_category
}, MODEL_PATH)

print(f"✅ Model trained and saved at {MODEL_PATH}")
