# backend/app/api/endpoints.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status, Body, FastAPI
from typing import List, Optional
from uuid import uuid4
from app.models.order import OrderDB
from app.schemas import Order, ItemCreate, ItemResponse
from app.models_db import ItemDB
from app.deps import get_current_user
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
import os, shutil
from app.store import USERS
from sqlmodel import select
from app.database import get_session
from pydantic import BaseModel
from app.ml.predict import predict_product_decision
from app.services.osm import fetch_nearby_services
from app.ml.predict import predict_product_decision
from app.ai_gemini import get_gemini_recommendation
from app.schemas import AISuggestion
import cloudinary
import cloudinary.uploader



router = APIRouter()
security = HTTPBearer()
# Base URL & image directory
BACKEND_BASE = os.getenv("BACKEND_URL", "https://smart-circular-marketplace-2.onrender.com")

IMAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images")
IMAGE_DIR = os.path.abspath(IMAGE_DIR)
os.makedirs(IMAGE_DIR, exist_ok=True)



# --- Signup ---
from pydantic import BaseModel

class SignupRequest(BaseModel):
    uid: str
    email: str
class StatusUpdate(BaseModel):
    status: str

@router.post("/signup")
async def signup(request: SignupRequest):
    USERS[request.uid] = request.email
    print("USERS after signup:", USERS)
    return {"message": "User registered successfully"}

# --- AI Prediction with optional adjustment ---
class AIPredictRequest(BaseModel):
    title: Optional[str] = None
    age: int
    condition: str
    category: str
    price: float
    co2_kg: float
    adjusted_price: Optional[float] = None

class ProductInput(BaseModel):
    title: str
    category: str
    price: float
    condition: str
    age: int
    co2_kg: float    
    adjusted_price: Optional[float] = None 

# 🔹 FRONTEND AI ENDPOINT
@router.post("/ai/predict", response_model=AISuggestion)
async def ai_predict(payload: AIPredictRequest):

    # Step 1: Call ML / rule-based decision engine
    result = predict_product_decision(
        category=payload.category,
        price=payload.price,
        condition=payload.condition,
        age=payload.age,
        co2_kg=payload.co2_kg
    )

    # Step 2: Extract values safely
    predicted_price = result.get("predicted_resale_value")
    action = result.get("recommendation")
    co2_saved = result.get("co2_saved_estimate", 0)

    # Step 3: Optional frontend override
    if payload.adjusted_price is not None:
        predicted_price = payload.adjusted_price

    # Step 4: Hard fallback (model failure safety)
    if predicted_price is None or action is None:
        predicted_price = payload.price * 0.8
        action = "RESELL"
        co2_saved = payload.co2_kg * 0.7
        explanation = "The item appears usable and resale helps recover value while reducing waste."
    else:
        # Step 5: Gemini = explanation ONLY
        prompt = (
            f"The system decided to {action} this product.\n"
            f"Category: {payload.category}\n"
            f"Condition: {payload.condition}\n"
            f"Age: {payload.age} years\n"
            f"Predicted resale price: ₹{predicted_price}\n\n"
            f"Explain this recommendation in one clear sentence for a user."
        )

        try:
            explanation = get_gemini_recommendation(prompt)
        except Exception as e:
            print("Gemini API error:", e)
            explanation = (
                f"The item condition and age indicate that {action.lower()} "
                f"is the most sustainable option."
            )

    # Step 6: Final response
    return {
        "predicted_price": predicted_price,
        "action": action,
        "explanation": explanation,
        "co2_saved_estimate": co2_saved
    }


# --- Create item (multipart/form-data, optional image) ---
@router.post("/items", status_code=status.HTTP_201_CREATED, response_model=ItemDB)
async def create_item(
    title: str = Form(...),
    category: str = Form(...),
    age: int = Form(...),
    condition: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    image: UploadFile = File(None),
    user=Depends(get_current_user),
):
    seller_uid = user["uid"]  # ✅ removed comma
    image_url = None

    if image is not None:
    # Upload to Cloudinary
     try:
        result = cloudinary.uploader.upload(
            image.file,
            folder="marketplace_items",  # optional folder
            public_id=str(uuid4().hex),  # unique name
            overwrite=True,
            resource_type="image"
        )
        image_url = result.get("secure_url")  # <-- full URL
     except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {e}")
     finally:
        image.file.close()

    item = ItemDB(
        title=title,
        category=category,
        age=age,
        condition=condition,
        description=description,
        price=price,
        image_url=image_url,
        seller_uid=seller_uid,
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
    # Extract public_id from URL
            public_id = item.image_url.split("/")[-1].split(".")[0]
            try:
              cloudinary.uploader.destroy(f"marketplace_items/{public_id}")
            except:
              pass

        session.delete(item)
        session.commit()
    return None

# --- Nearby / Impact ---


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


@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(
    data: dict,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    item = session.get(ItemDB, data["item_id"])
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    order = OrderDB(
        item_id=item.id,
        buyer_uid=user["uid"],
        seller_uid=item.seller_uid,
        price=item.price,
        status="PENDING"
    )

    session.add(order)
    session.delete(item)
    session.commit()
    session.refresh(order)

    return order

@router.get("/orders")
def list_orders(session=Depends(get_session), user=Depends(get_current_user)):
    stmt = select(OrderDB).where(
        (OrderDB.buyer_uid == user["uid"]) |
        (OrderDB.seller_uid == user["uid"])
    ).order_by(OrderDB.created_at.desc())

    return session.exec(stmt).all()

@router.patch("/orders/{order_id}")
def update_order_status(
    order_id: int,
    data: dict,
    session=Depends(get_session),
    user=Depends(get_current_user)
):
    order = session.get(OrderDB, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if user["uid"] != order.seller_uid:
        raise HTTPException(status_code=403, detail="Only seller can update status")

    order.status = data["status"]
    session.add(order)
    session.commit()

    return {"success": True}

@router.post("/predict")
def predict_product(data: ProductInput):
    return predict_product_decision(
        title=data.title,
        category=data.category,
        price=data.price,
        condition=data.condition,
        age=data.age,
        co2_kg=data.co2_kg
    )