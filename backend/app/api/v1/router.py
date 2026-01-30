"""API v1 router aggregating all routes."""

from fastapi import APIRouter

from app.api.v1 import analytics, chat, expenses, goals, impact, pots, users

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(pots.router, prefix="/pots", tags=["pots"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(impact.router, prefix="/impact", tags=["impact"])
