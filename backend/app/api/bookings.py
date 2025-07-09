"""
Booking management endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.get("/")
async def get_bookings():
    """Get user's bookings"""
    return {"bookings": [], "total": 0}


@router.post("/")
async def create_booking():
    """Create a new booking"""
    return {"message": "Booking creation endpoint - TODO"}