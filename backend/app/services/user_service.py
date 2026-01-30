"""User service."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.pot import Pot
from app.models.pot import PotCategory as PotCategoryModel
from app.models.user import User
from app.schemas.user import OnboardingData, UserUpdate


class UserService:
    """Service for user operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> User:
        """Get user by ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User")
        return user

    async def update(self, user: User, data: UserUpdate) -> User:
        """Update user profile."""
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def complete_onboarding(
        self,
        user: User,
        data: OnboardingData,
    ) -> User:
        """Complete user onboarding with pot allocations."""
        # Update user info
        user.name = data.name
        user.monthly_income = data.monthly_income
        user.currency = data.currency
        user.onboarding_completed = True

        # Create pots based on allocations
        for pot_data in data.pots:
            # Calculate target amount based on monthly income and percentage
            target_amount = (data.monthly_income * pot_data.percentage) / 100

            pot = Pot(
                user_id=user.id,
                name=pot_data.name,
                category=PotCategoryModel(pot_data.category.value),
                percentage=pot_data.percentage,
                current_amount=0,
                target_amount=target_amount,
                color=pot_data.color,
                icon=pot_data.icon,
            )
            self.db.add(pot)

        await self.db.flush()
        await self.db.refresh(user)
        return user
