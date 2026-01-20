from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints
from app.api.endpoints import router as api_router
from app.database import create_db_and_tables
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
BACKEND_BASE = os.getenv("BACKEND_URL", "http://localhost:8000")
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("🛑 App shutdown")
def get_image_url(request: Request, filename: str):
    return f"{request.base_url}static/images/{filename}"
# Create app with lifespan
app = FastAPI(title="Smart Circular Marketplace Prototype", lifespan=lifespan)

# --- CORS configuration ---
origins = [
    "https://smart-circular-marketplace-pveh.vercel.app",
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
STATIC_DIR = os.path.join(BASE_DIR, "static")
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "images"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include API router
app.include_router(endpoints.router, prefix="/api")
