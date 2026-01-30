"""Analytics service."""

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.expense import Expense
from app.models.goal import Goal
from app.models.goal import GoalStatus as GoalStatusModel
from app.models.pot import Pot
from app.models.user import User
from app.schemas.analytics import (
    ChartDataPoint,
    DashboardData,
    GoalProgressData,
    PotDistribution,
    SpendingTrend,
    TimeSeriesDataPoint,
)
from app.schemas.expense import ExpenseCategory
from app.schemas.goal import GoalStatus


class AnalyticsService:
    """Service for analytics operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard(self, user_id: uuid.UUID) -> DashboardData:
        """Get main dashboard data."""
        # Get user
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one()

        # Get pots for total balance and distribution
        pots_result = await self.db.execute(
            select(Pot).where(Pot.user_id == user_id)
        )
        pots = list(pots_result.scalars().all())
        total_balance = sum(float(pot.current_amount) for pot in pots)

        pot_distribution = [
            ChartDataPoint(
                name=pot.name,
                value=float(pot.current_amount),
                fill=pot.color,
            )
            for pot in pots
        ]

        # Get expenses this month
        now = datetime.now(timezone.utc)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        expenses_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .join(Pot)
            .where(Pot.user_id == user_id, Expense.date >= month_start)
        )
        total_expenses = float(expenses_result.scalar() or 0)

        # Get spending by category
        category_result = await self.db.execute(
            select(Expense.category, func.sum(Expense.amount))
            .join(Pot)
            .where(Pot.user_id == user_id, Expense.date >= month_start)
            .group_by(Expense.category)
        )

        category_colors = {
            "food": "#ef4444",
            "transport": "#f97316",
            "utilities": "#eab308",
            "entertainment": "#22c55e",
            "shopping": "#06b6d4",
            "health": "#3b82f6",
            "education": "#8b5cf6",
            "other": "#6b7280",
        }

        spending_by_category = [
            ChartDataPoint(
                name=row[0].value,
                value=float(row[1]),
                fill=category_colors.get(row[0].value, "#6b7280"),
            )
            for row in category_result.all()
        ]

        # Get goal counts
        goals_result = await self.db.execute(
            select(Goal.status, func.count(Goal.id))
            .join(Pot)
            .where(Pot.user_id == user_id)
            .group_by(Goal.status)
        )
        goal_counts = {row[0]: row[1] for row in goals_result.all()}

        # Calculate savings rate
        monthly_income = float(user.monthly_income) if user.monthly_income else 0
        savings_rate = 0.0
        if monthly_income > 0:
            savings_rate = ((monthly_income - total_expenses) / monthly_income) * 100

        return DashboardData(
            total_balance=total_balance,
            monthly_income=monthly_income,
            total_expenses_this_month=total_expenses,
            savings_rate=max(0, savings_rate),
            pot_distribution=pot_distribution,
            spending_by_category=spending_by_category,
            active_goals_count=goal_counts.get(GoalStatusModel.ACTIVE, 0),
            completed_goals_count=goal_counts.get(GoalStatusModel.COMPLETED, 0),
        )

    async def get_spending_trends(
        self,
        user_id: uuid.UUID,
        days: int = 30,
    ) -> SpendingTrend:
        """Get spending trends over time."""
        now = datetime.now(timezone.utc)
        period_start = now - timedelta(days=days)
        prev_period_start = period_start - timedelta(days=days)

        # Get daily spending for current period
        daily_result = await self.db.execute(
            select(
                func.date(Expense.date),
                func.sum(Expense.amount),
            )
            .join(Pot)
            .where(Pot.user_id == user_id, Expense.date >= period_start)
            .group_by(func.date(Expense.date))
            .order_by(func.date(Expense.date))
        )

        data = [
            TimeSeriesDataPoint(date=str(row[0]), amount=float(row[1]))
            for row in daily_result.all()
        ]

        # Get totals for comparison
        current_total_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .join(Pot)
            .where(Pot.user_id == user_id, Expense.date >= period_start)
        )
        total_this_period = float(current_total_result.scalar() or 0)

        prev_total_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .join(Pot)
            .where(
                Pot.user_id == user_id,
                Expense.date >= prev_period_start,
                Expense.date < period_start,
            )
        )
        total_last_period = float(prev_total_result.scalar() or 0)

        change_percentage = 0.0
        if total_last_period > 0:
            change_percentage = (
                (total_this_period - total_last_period) / total_last_period
            ) * 100

        return SpendingTrend(
            data=data,
            total_this_period=total_this_period,
            total_last_period=total_last_period,
            change_percentage=change_percentage,
        )

    async def get_pot_distribution(self, user_id: uuid.UUID) -> PotDistribution:
        """Get pot allocation breakdown."""
        pots_result = await self.db.execute(
            select(Pot).where(Pot.user_id == user_id)
        )
        pots = list(pots_result.scalars().all())

        total_amount = sum(float(pot.current_amount) for pot in pots)

        data = [
            ChartDataPoint(
                name=pot.name,
                value=float(pot.current_amount),
                fill=pot.color,
            )
            for pot in pots
        ]

        return PotDistribution(data=data, total_amount=total_amount)

    async def get_goal_progress(self, user_id: uuid.UUID) -> list[GoalProgressData]:
        """Get goal progress overview."""
        goals_result = await self.db.execute(
            select(Goal).join(Pot).where(Pot.user_id == user_id).order_by(Goal.deadline)
        )
        goals = list(goals_result.scalars().all())

        now = datetime.now(timezone.utc)
        result = []

        for goal in goals:
            target = float(goal.target_amount)
            current = float(goal.current_amount)
            progress = (current / target * 100) if target > 0 else 0

            days_remaining = None
            if goal.deadline:
                delta = goal.deadline - now
                days_remaining = max(0, delta.days)

            result.append(
                GoalProgressData(
                    goal_id=goal.id,
                    title=goal.title,
                    target_amount=target,
                    current_amount=current,
                    progress_percentage=min(100, progress),
                    status=GoalStatus(goal.status.value),
                    deadline=goal.deadline,
                    days_remaining=days_remaining,
                )
            )

        return result
