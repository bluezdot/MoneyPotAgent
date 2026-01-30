"""AI Coach for financial guidance."""

import json
import logging
import uuid
from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.client import get_openai_client
from app.ai.prompts import SYSTEM_PROMPT, build_context_prompt
from app.config import get_settings
from app.models.chat import ChatMessage, ChatSession, MessageRole, MessageType
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.pot import Pot
from app.models.user import User

logger = logging.getLogger(__name__)
settings = get_settings()


class AICoach:
    """AI Financial Health Coach."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.client = get_openai_client()
        self.model = settings.openai_model

    async def _get_user_context(self, user_id: uuid.UUID) -> dict[str, Any]:
        """Get user's financial context for the AI."""
        # Get user
        user_result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = user_result.scalar_one()

        # Get pots with goals
        pots_result = await self.db.execute(
            select(Pot)
            .where(Pot.user_id == user_id)
            .options(selectinload(Pot.goals))
        )
        pots = list(pots_result.scalars().all())

        # Get recent expenses
        expenses_result = await self.db.execute(
            select(Expense)
            .join(Pot)
            .where(Pot.user_id == user_id)
            .order_by(Expense.date.desc())
            .limit(10)
        )
        expenses = list(expenses_result.scalars().all())

        return {
            "user": user,
            "pots": pots,
            "goals": [g for p in pots for g in p.goals],
            "expenses": expenses,
        }

    async def _build_messages(
        self,
        user_id: uuid.UUID,
        session_id: uuid.UUID,
        new_message: str,
    ) -> list[dict[str, str]]:
        """Build message list for OpenAI API."""
        # Get user context
        context = await self._get_user_context(user_id)
        user = context["user"]

        # Build context prompt
        context_prompt = build_context_prompt(
            user_name=user.name,
            monthly_income=float(user.monthly_income),
            currency=user.currency,
            pots=[
                {
                    "name": p.name,
                    "category": p.category.value,
                    "current_amount": float(p.current_amount),
                    "target_amount": float(p.target_amount),
                    "percentage": float(p.percentage),
                }
                for p in context["pots"]
            ],
            goals=[
                {
                    "title": g.title,
                    "current_amount": float(g.current_amount),
                    "target_amount": float(g.target_amount),
                    "status": g.status.value,
                }
                for g in context["goals"]
            ],
            recent_expenses=[
                {
                    "description": e.description,
                    "amount": float(e.amount),
                    "category": e.category.value,
                }
                for e in context["expenses"]
            ],
        )

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + "\n\n" + context_prompt}
        ]

        # Get conversation history
        history_result = await self.db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
        )
        history = list(history_result.scalars().all())

        for msg in history:
            messages.append({
                "role": msg.role.value,
                "content": msg.content,
            })

        # Add new message
        messages.append({"role": "user", "content": new_message})

        return messages

    async def generate_response(
        self,
        user_id: uuid.UUID,
        session_id: uuid.UUID,
        message: str,
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response from the AI coach."""
        messages = await self._build_messages(user_id, session_id, message)

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000,
            )

            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            yield f"I apologize, but I encountered an error. Please try again."

    async def generate_quick_actions(
        self,
        user_id: uuid.UUID,
    ) -> list[dict[str, str]]:
        """Generate context-aware quick actions."""
        context = await self._get_user_context(user_id)

        actions = []

        # Check for low pot balances
        for pot in context["pots"]:
            if float(pot.current_amount) < float(pot.target_amount) * 0.2:
                actions.append({
                    "id": f"low_pot_{pot.id}",
                    "label": f"Top up {pot.name}",
                    "icon": "plus-circle",
                    "action": f"transfer_to_pot:{pot.id}",
                })

        # Check for goals near completion
        for goal in context["goals"]:
            progress = float(goal.current_amount) / float(goal.target_amount)
            if 0.8 <= progress < 1.0:
                remaining = float(goal.target_amount) - float(goal.current_amount)
                actions.append({
                    "id": f"complete_goal_{goal.id}",
                    "label": f"Complete {goal.title}",
                    "icon": "target",
                    "action": f"contribute_to_goal:{goal.id}:{remaining}",
                })

        # Add general actions
        actions.extend([
            {
                "id": "add_expense",
                "label": "Log expense",
                "icon": "receipt",
                "action": "add_expense",
            },
            {
                "id": "check_impact",
                "label": "Check purchase impact",
                "icon": "calculator",
                "action": "analyze_impact",
            },
        ])

        return actions[:4]  # Return max 4 quick actions

    async def generate_insights(
        self,
        user_id: uuid.UUID,
    ) -> list[dict[str, Any]]:
        """Generate AI-powered financial insights."""
        context = await self._get_user_context(user_id)
        user = context["user"]
        insights = []

        # Spending pattern insight
        total_expenses = sum(float(e.amount) for e in context["expenses"])
        if context["expenses"]:
            avg_expense = total_expenses / len(context["expenses"])
            insights.append({
                "id": f"insight_{uuid.uuid4().hex[:8]}",
                "title": "Spending Pattern",
                "description": f"Your average expense is {user.currency}{avg_expense:.2f}. "
                              "Consider if each purchase aligns with your goals.",
                "type": "tip",
                "createdAt": context["expenses"][0].created_at.isoformat(),
            })

        # Goal progress insight
        active_goals = [g for g in context["goals"] if g.status.value == "active"]
        if active_goals:
            closest_goal = min(
                active_goals,
                key=lambda g: float(g.target_amount) - float(g.current_amount),
            )
            remaining = float(closest_goal.target_amount) - float(closest_goal.current_amount)
            insights.append({
                "id": f"insight_{uuid.uuid4().hex[:8]}",
                "title": "Almost There!",
                "description": f"You're {user.currency}{remaining:.2f} away from "
                              f"completing '{closest_goal.title}'. Keep going!",
                "type": "achievement",
                "createdAt": closest_goal.created_at.isoformat(),
            })

        # Low balance warning
        for pot in context["pots"]:
            balance_ratio = float(pot.current_amount) / float(pot.target_amount) if pot.target_amount else 1
            if balance_ratio < 0.2 and pot.category.value == "necessities":
                insights.append({
                    "id": f"insight_{uuid.uuid4().hex[:8]}",
                    "title": "Low Balance Alert",
                    "description": f"Your {pot.name} pot is running low. "
                                  "Consider transferring funds or reducing spending.",
                    "type": "warning",
                    "createdAt": pot.updated_at.isoformat(),
                })

        return insights[:5]  # Return max 5 insights
