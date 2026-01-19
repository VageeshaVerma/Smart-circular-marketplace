from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints
from app.api.endpoints import router as api_router
from app.database import create_db_and_tables
import os
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("🛑 App shutdown")

# Create app with lifespan
app = FastAPI(title="Smart Circular Marketplace Prototype", lifespan=lifespan)

# --- CORS configuration ---
origins = [
    "http://localhost:5173",  # React frontend
    "http://localhost:3000",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static folder exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(BASE_DIR, "static")
os.makedirs(os.path.join(static_path, "images"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Include API router
app.include_router(endpoints.router, prefix="/api")
