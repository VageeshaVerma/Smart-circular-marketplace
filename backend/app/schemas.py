# app/schemas.py
from pydantic import BaseModel
from typing import Literal, Optional

class ItemCreate(BaseModel):
    title: str
    category: str
    age: int
    condition: str
    description: str

class ItemResponse(ItemCreate):
    id: int
    price: float

class AISuggestion(BaseModel):
    predicted_price: float
    action: Literal["RESELL", "REPAIR", "RECYCLE"]
    explanation: str
    co2_saved_estimate: float

class Service(BaseModel):
    name: str
    lat: float
    lng: float
    type: str

class UserImpact(BaseModel):
    waste_diverted_kg: float
    carbon_saved_kg: float
    items_reused: int

class Order(BaseModel):
    id: int
    item_id: int
    buyer_uid: str
    status: Literal["PENDING", "CONFIRMED", "COMPLETED"]

class AIPredictRequest(BaseModel):
    
    category: str
    price: float
    condition: str
    age: int
    co2_kg: float
    adjusted_price: Optional[float] = None   