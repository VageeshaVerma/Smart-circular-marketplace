# backend/app/firebase.py
import os
import firebase_admin
from firebase_admin import credentials, auth

# Compute absolute path to the JSON
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(BASE_DIR, "firebase-service-account.json")

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

def verify_token(token: str):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # contains uid, email, etc.
    except Exception as e:
        print("Token verification failed:", e)
        return None
