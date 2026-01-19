# backend/app/models_db.py
from sqlmodel import SQLModel, Field
from typing import Optional, List

class ItemDB(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str
    age: int
    condition: str
    description: Optional[str] = ""
    price: float
    image_url: Optional[str] = None
    seller_uid: str = "demo"