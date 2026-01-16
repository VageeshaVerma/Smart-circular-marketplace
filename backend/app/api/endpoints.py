# backend/app/api/endpoints.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status, Body
from typing import List, Optional
from uuid import uuid4
import os, shutil
from app.store import USERS
from sqlmodel import select
from app.database import get_session
from app.models_db import ItemDB
from app.services.osm import fetch_nearby_services
from app.deps import get_current_user
from app.ai_sim import predict_price
from app.models import AISuggestion

router = APIRouter()

# Base URL & image directory
BACKEND_BASE = "http://localhost:8000"
IMAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images")
IMAGE_DIR = os.path.abspath(IMAGE_DIR)
os.makedirs(IMAGE_DIR, exist_ok=True)



# --- Signup ---
from pydantic import BaseModel

class SignupRequest(BaseModel):
    uid: str
    email: str

@router.post("/signup")
async def signup(request: SignupRequest):
    USERS[request.uid] = request.email
    print("USERS after signup:", USERS)
    return {"message": "User registered successfully"}

# --- AI Prediction with optional adjustment ---
class AIPredictRequest(BaseModel):
    age: int
    condition: str
    category: str
    adjusted_price: Optional[float] = None

@router.post("/ai/predict", response_model=AISuggestion)
async def ai_predict(payload: AIPredictRequest = Body(...)):
    suggested_price = predict_price(payload.age, payload.condition, payload.category)

    # Override predicted price if frontend provides adjusted_price
    if payload.adjusted_price is not None:
        suggested_price["predicted_price"] = payload.adjusted_price

    return suggested_price

# --- Create item (multipart/form-data, optional image) ---
@router.post("/items", status_code=status.HTTP_201_CREATED, response_model=ItemDB)
async def create_item(
    title: str = Form(...),
    category: str = Form(...),
    age: int = Form(...),
    condition: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),  # <-- Pass AI predicted or adjusted price from frontend
    image: UploadFile = File(None),
    user=Depends(get_current_user)
):
    """
    Accepts multipart/form-data with optional image file.
    Saves image to app/static/images and returns item with price and image_url.
    """
    image_url = None
    if image is not None:
        filename = image.filename or "upload.jpg"
        _, ext = os.path.splitext(filename)
        unique_name = f"{uuid4().hex}{ext or '.jpg'}"
        dest_path = os.path.join(IMAGE_DIR, unique_name)
        try:
            with open(dest_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"{BACKEND_BASE}/static/images/{unique_name}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save image: {e}")
        finally:
            image.file.close()

    item = ItemDB(
        title=title,
        category=category,
        age=age,
        condition=condition,
        description=description,
        price=price,  # Use frontend-provided (predicted/adjusted) price
        image_url=image_url,
    )

    with get_session() as session:
        session.add(item)
        session.commit()
        session.refresh(item)

    return item

# --- List items ---
@router.get("/items", response_model=List[ItemDB])
async def list_items():
    with get_session() as session:
        items = session.exec(select(ItemDB).order_by(ItemDB.id.desc())).all()
    return items

# --- Get single item ---
@router.get("/items/{item_id}", response_model=ItemDB)
async def get_item(item_id: int):
    with get_session() as session:
        item = session.get(ItemDB, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
    return item

# --- Delete item ---
@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    with get_session() as session:
        item = session.get(ItemDB, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        # Delete image file if exists
        if item.image_url:
            try:
                filename = item.image_url.rsplit("/", 1)[-1]
                path = os.path.join(IMAGE_DIR, filename)
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass
        session.delete(item)
        session.commit()
    return None

# --- Nearby / Impact ---
from app.db import NEARBY_SERVICES, USER_IMPACT

@router.get("/nearby")
async def nearby_services(lat: float, lng: float, type: str = "all"):
    if type == "all":
        return NEARBY_SERVICES
    return [s for s in NEARBY_SERVICES if s["type"] == type]

@router.get("/impact")
async def user_impact(user_id: str):
    return USER_IMPACT.get(user_id, {"waste_diverted_kg":0,"carbon_saved_kg":0,"items_reused":0})

@router.get("/nearby/osm")
async def nearby_osm(lat: float, lng: float):
    return fetch_nearby_services(lat, lng)

# --- Stats (TODO placeholders) ---
@router.get("/monthly-stats")
async def monthly_stats(user_id: str):
    return {"message": "TODO"}

@router.get("/category-stats")
async def category_stats(user_id: str):
    return {"message": "TODO"}

# --- Get current user profile ---
@router.get("/me")
async def get_profile(user=Depends(get_current_user)):
    return {"uid": user["uid"], "email": user.get("email")}
