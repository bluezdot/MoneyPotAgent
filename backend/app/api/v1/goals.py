"""Goals API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import CurrentUserId, DbSession
from app.schemas.goal import (
    GoalContribution,
    GoalCreate,
    GoalResponse,
    GoalUpdate,
    MilestoneCreate,
    MilestoneResponse,
    MilestoneUpdate,
)
from app.services.goal_service import GoalService

router = APIRouter()


@router.get("/", response_model=list[GoalResponse])
async def list_goals(
    user_id: CurrentUserId,
    db: DbSession,
) -> list[GoalResponse]:
    """List all goals for the current user."""
    service = GoalService(db)
    goals = await service.list_for_user(user_id)
    return [GoalResponse.model_validate(goal) for goal in goals]


@router.post("/", response_model=GoalResponse, status_code=201)
async def create_goal(
    data: GoalCreate,
    user_id: CurrentUserId,
    db: DbSession,
) -> GoalResponse:
    """Create a new goal with optional milestones."""
    service = GoalService(db)
    goal = await service.create(user_id, data)
    return GoalResponse.model_validate(goal)


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> GoalResponse:
    """Get a specific goal."""
    service = GoalService(db)
    goal = await service.get_by_id(goal_id, user_id)
    return GoalResponse.model_validate(goal)


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: UUID,
    data: GoalUpdate,
    user_id: CurrentUserId,
    db: DbSession,
) -> GoalResponse:
    """Update a goal."""
    service = GoalService(db)
    goal = await service.get_by_id(goal_id, user_id)
    updated_goal = await service.update(goal, data)
    return GoalResponse.model_validate(updated_goal)


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(
    goal_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> None:
    """Delete a goal."""
    service = GoalService(db)
    goal = await service.get_by_id(goal_id, user_id)
    await service.delete(goal)


@router.post("/{goal_id}/contribute", response_model=GoalResponse)
async def contribute_to_goal(
    goal_id: UUID,
    data: GoalContribution,
    user_id: CurrentUserId,
    db: DbSession,
) -> GoalResponse:
    """Add funds to a goal."""
    service = GoalService(db)
    goal = await service.get_by_id(goal_id, user_id)
    updated_goal = await service.contribute(goal, data)
    return GoalResponse.model_validate(updated_goal)


@router.post("/{goal_id}/milestones", response_model=MilestoneResponse, status_code=201)
async def add_milestone(
    goal_id: UUID,
    data: MilestoneCreate,
    user_id: CurrentUserId,
    db: DbSession,
) -> MilestoneResponse:
    """Add a milestone to a goal."""
    service = GoalService(db)
    goal = await service.get_by_id(goal_id, user_id)
    milestone = await service.add_milestone(goal, data)
    return MilestoneResponse.model_validate(milestone)


@router.put("/{goal_id}/milestones/{milestone_id}", response_model=MilestoneResponse)
async def update_milestone(
    goal_id: UUID,
    milestone_id: UUID,
    data: MilestoneUpdate,
    user_id: CurrentUserId,
    db: DbSession,
) -> MilestoneResponse:
    """Update a milestone."""
    service = GoalService(db)
    milestone = await service.update_milestone(goal_id, milestone_id, data, user_id)
    return MilestoneResponse.model_validate(milestone)
