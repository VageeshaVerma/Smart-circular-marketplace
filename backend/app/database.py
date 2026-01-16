# backend/app/database.py
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel import select
from typing import Optional
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "marketplace.db")
DB_FILE = os.path.abspath(DB_FILE)
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Session:
    return Session(engine)
