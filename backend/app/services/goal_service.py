"""Goal service."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException, ValidationException
from app.models.goal import Goal, Milestone
from app.models.goal import GoalPriority as GoalPriorityModel
from app.models.goal import GoalStatus as GoalStatusModel
from app.models.pot import Pot
from app.schemas.goal import (
    GoalContribution,
    GoalCreate,
    GoalUpdate,
    MilestoneCreate,
    MilestoneUpdate,
)


class GoalService:
    """Service for goal operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, goal_id: uuid.UUID, user_id: uuid.UUID) -> Goal:
        """Get goal by ID for a specific user."""
        result = await self.db.execute(
            select(Goal)
            .join(Pot)
            .where(Goal.id == goal_id, Pot.user_id == user_id)
            .options(selectinload(Goal.milestones))
        )
        goal = result.scalar_one_or_none()
        if not goal:
            raise NotFoundException("Goal")
        return goal

    async def list_for_user(self, user_id: uuid.UUID) -> list[Goal]:
        """List all goals for a user."""
        result = await self.db.execute(
            select(Goal)
            .join(Pot)
            .where(Pot.user_id == user_id)
            .options(selectinload(Goal.milestones))
            .order_by(Goal.created_at.desc())
        )
        return list(result.scalars().all())

    async def create(self, user_id: uuid.UUID, data: GoalCreate) -> Goal:
        """Create a new goal with milestones."""
        # Verify pot belongs to user
        result = await self.db.execute(
            select(Pot).where(Pot.id == data.pot_id, Pot.user_id == user_id)
        )
        pot = result.scalar_one_or_none()
        if not pot:
            raise NotFoundException("Pot")

        goal = Goal(
            pot_id=data.pot_id,
            title=data.title,
            description=data.description,
            target_amount=data.target_amount,
            current_amount=0,
            deadline=data.deadline,
            priority=GoalPriorityModel(data.priority.value),
            status=GoalStatusModel.ACTIVE,
        )
        self.db.add(goal)
        await self.db.flush()

        # Create milestones
        for milestone_data in data.milestones:
            milestone = Milestone(
                goal_id=goal.id,
                title=milestone_data.title,
                target_amount=milestone_data.target_amount,
                completed=False,
            )
            self.db.add(milestone)

        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def update(self, goal: Goal, data: GoalUpdate) -> Goal:
        """Update a goal."""
        update_data = data.model_dump(exclude_unset=True, by_alias=False)
        for field, value in update_data.items():
            if field == "priority" and value is not None:
                value = GoalPriorityModel(value.value)
            elif field == "status" and value is not None:
                value = GoalStatusModel(value.value)
            setattr(goal, field, value)
        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def delete(self, goal: Goal) -> None:
        """Delete a goal."""
        await self.db.delete(goal)
        await self.db.flush()

    async def contribute(
        self,
        goal: Goal,
        data: GoalContribution,
    ) -> Goal:
        """Add funds to a goal."""
        goal.current_amount = float(goal.current_amount) + data.amount

        # Check if goal is completed
        if goal.current_amount >= goal.target_amount:
            goal.status = GoalStatusModel.COMPLETED

        # Update milestones
        for milestone in goal.milestones:
            if not milestone.completed and goal.current_amount >= milestone.target_amount:
                milestone.completed = True
                milestone.completed_at = datetime.now(timezone.utc)

        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def add_milestone(
        self,
        goal: Goal,
        data: MilestoneCreate,
    ) -> Milestone:
        """Add a milestone to a goal."""
        milestone = Milestone(
            goal_id=goal.id,
            title=data.title,
            target_amount=data.target_amount,
            completed=goal.current_amount >= data.target_amount,
        )
        if milestone.completed:
            milestone.completed_at = datetime.now(timezone.utc)

        self.db.add(milestone)
        await self.db.flush()
        await self.db.refresh(milestone)
        return milestone

    async def update_milestone(
        self,
        goal_id: uuid.UUID,
        milestone_id: uuid.UUID,
        data: MilestoneUpdate,
        user_id: uuid.UUID,
    ) -> Milestone:
        """Update a milestone."""
        # Verify goal belongs to user
        goal = await self.get_by_id(goal_id, user_id)

        result = await self.db.execute(
            select(Milestone).where(
                Milestone.id == milestone_id,
                Milestone.goal_id == goal.id,
            )
        )
        milestone = result.scalar_one_or_none()
        if not milestone:
            raise NotFoundException("Milestone")

        update_data = data.model_dump(exclude_unset=True, by_alias=False)
        for field, value in update_data.items():
            if field == "completed" and value is True and not milestone.completed:
                milestone.completed_at = datetime.now(timezone.utc)
            setattr(milestone, field, value)

        await self.db.flush()
        await self.db.refresh(milestone)
        return milestone
