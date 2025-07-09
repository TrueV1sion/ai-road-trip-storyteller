"""
AI Road Trip Storyteller Backend API
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api import auth, users, stories, bookings, health
from app.core.config import settings
from app.core.database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    """
    # Startup
    logger.info("Starting AI Road Trip Storyteller API...")
    try:
        # Try to create database tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database connected successfully")
    except Exception as e:
        logger.warning(f"Database connection failed: {e}")
        logger.warning("Running without database - some features will be limited")
    yield
    # Shutdown
    logger.info("Shutting down API...")

# Create FastAPI application
app = FastAPI(
    title="AI Road Trip Storyteller API",
    description="Transform your journey into an unforgettable adventure",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(stories.router, prefix="/api/stories", tags=["stories"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Road Trip Storyteller API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )