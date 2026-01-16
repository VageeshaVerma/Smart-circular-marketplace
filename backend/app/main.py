# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints
from app.config import API_PREFIX
import os

from app.database import create_db_and_tables

app = FastAPI(title="Smart Circular Marketplace Prototype")

# Allow frontend dev server (Vite) to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static/images folder exists and mount it
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(BASE_DIR, "static")
os.makedirs(os.path.join(static_path, "images"), exist_ok=True)

app.mount("/static", StaticFiles(directory=static_path), name="static")

create_db_and_tables()

app.include_router(endpoints.router, prefix=API_PREFIX)
