import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

# Load data
data = pd.read_csv("training_data.csv")

X = data[["age", "condition", "category"]]
y = data["price"]

# Preprocessing
categorical_features = ["condition", "category"]
numeric_features = ["age"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features),
    ]
)

# Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

# Pipeline
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)

# Train
pipeline.fit(X, y)

# Save model
os.makedirs("models", exist_ok=True)
joblib.dump(pipeline, "models/price_model.pkl")

print("✅ Model trained and saved successfully")
