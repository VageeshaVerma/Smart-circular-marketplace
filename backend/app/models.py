from pydantic import BaseModel

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
    recommendation: str

class Service(BaseModel):
    name: str
    lat: float
    lng: float
    type: str

class UserImpact(BaseModel):
    waste_diverted_kg: float
    carbon_saved_kg: float
    items_reused: int
