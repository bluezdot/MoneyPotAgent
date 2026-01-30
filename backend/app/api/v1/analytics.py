"""Analytics API endpoints."""

from fastapi import APIRouter, Query

from app.ai.coach import AICoach
from app.api.deps import CurrentUserId, DbSession
from app.schemas.analytics import (
    AIInsight,
    DashboardData,
    GoalProgressData,
    PotDistribution,
    SpendingTrend,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(
    user_id: CurrentUserId,
    db: DbSession,
) -> DashboardData:
    """Get main dashboard data."""
    service = AnalyticsService(db)
    return await service.get_dashboard(user_id)


@router.get("/spending-trends", response_model=SpendingTrend)
async def get_spending_trends(
    user_id: CurrentUserId,
    db: DbSession,
    days: int = Query(30, ge=7, le=365),
) -> SpendingTrend:
    """Get spending trends over time."""
    service = AnalyticsService(db)
    return await service.get_spending_trends(user_id, days)


@router.get("/pot-distribution", response_model=PotDistribution)
async def get_pot_distribution(
    user_id: CurrentUserId,
    db: DbSession,
) -> PotDistribution:
    """Get pot allocation breakdown."""
    service = AnalyticsService(db)
    return await service.get_pot_distribution(user_id)


@router.get("/goal-progress", response_model=list[GoalProgressData])
async def get_goal_progress(
    user_id: CurrentUserId,
    db: DbSession,
) -> list[GoalProgressData]:
    """Get goal progress overview."""
    service = AnalyticsService(db)
    return await service.get_goal_progress(user_id)


@router.get("/insights", response_model=list[AIInsight])
async def get_insights(
    user_id: CurrentUserId,
    db: DbSession,
) -> list[AIInsight]:
    """Get AI-generated insights."""
    coach = AICoach(db)
    insights = await coach.generate_insights(user_id)
    return [AIInsight.model_validate(insight) for insight in insights]
