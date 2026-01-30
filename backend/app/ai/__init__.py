"""AI module."""

from app.ai.client import get_openai_client
from app.ai.coach import AICoach

__all__ = ["get_openai_client", "AICoach"]
