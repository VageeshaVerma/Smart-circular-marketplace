from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class OrderDB(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    item_id: int
    buyer_uid: str
    seller_uid: str
    price: float

    status: str = Field(default="PENDING")  
    created_at: datetime = Field(default_factory=datetime.utcnow)
