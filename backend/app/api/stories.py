"""
Story generation and management endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.post("/generate")
async def generate_story():
    """Generate AI story based on location and context"""
    # TODO: Integrate with Vertex AI
    return {
        "id": "mock-story-123",
        "title": "The Journey Begins",
        "content": "Your adventure starts here...",
        "narrator": "Default Narrator",
        "duration": 180
    }


@router.get("/")
async def get_stories():
    """Get user's stories"""
    return {"stories": [], "total": 0}