"""
User management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.get("/profile")
async def get_profile():
    """Get current user profile"""
    return {"message": "User profile endpoint - TODO"}


@router.put("/profile")
async def update_profile():
    """Update user profile"""
    return {"message": "Update profile endpoint - TODO"}