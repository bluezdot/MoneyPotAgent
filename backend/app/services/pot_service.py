"""Pot service."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ValidationException
from app.models.pot import Pot
from app.models.pot import PotCategory as PotCategoryModel
from app.schemas.pot import PotCreate, PotTransfer, PotUpdate


class PotService:
    """Service for pot operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, pot_id: uuid.UUID, user_id: uuid.UUID) -> Pot:
        """Get pot by ID for a specific user."""
        result = await self.db.execute(
            select(Pot).where(Pot.id == pot_id, Pot.user_id == user_id)
        )
        pot = result.scalar_one_or_none()
        if not pot:
            raise NotFoundException("Pot")
        return pot

    async def list_for_user(self, user_id: uuid.UUID) -> list[Pot]:
        """List all pots for a user."""
        result = await self.db.execute(
            select(Pot).where(Pot.user_id == user_id).order_by(Pot.created_at)
        )
        return list(result.scalars().all())

    async def create(self, user_id: uuid.UUID, data: PotCreate) -> Pot:
        """Create a new pot."""
        pot = Pot(
            user_id=user_id,
            name=data.name,
            category=PotCategoryModel(data.category.value),
            percentage=data.percentage,
            current_amount=0,
            target_amount=data.target_amount,
            color=data.color,
            icon=data.icon,
        )
        self.db.add(pot)
        await self.db.flush()
        await self.db.refresh(pot)
        return pot

    async def update(self, pot: Pot, data: PotUpdate) -> Pot:
        """Update a pot."""
        update_data = data.model_dump(exclude_unset=True, by_alias=False)
        for field, value in update_data.items():
            if field == "category" and value is not None:
                value = PotCategoryModel(value.value)
            setattr(pot, field, value)
        await self.db.flush()
        await self.db.refresh(pot)
        return pot

    async def delete(self, pot: Pot) -> None:
        """Delete a pot."""
        await self.db.delete(pot)
        await self.db.flush()

    async def transfer(
        self,
        from_pot: Pot,
        data: PotTransfer,
        user_id: uuid.UUID,
    ) -> tuple[Pot, Pot]:
        """Transfer money between pots."""
        # Get destination pot
        to_pot = await self.get_by_id(data.to_pot_id, user_id)

        # Validate transfer
        if from_pot.current_amount < data.amount:
            raise ValidationException("Insufficient funds in source pot")

        if from_pot.id == to_pot.id:
            raise ValidationException("Cannot transfer to the same pot")

        # Perform transfer
        from_pot.current_amount = float(from_pot.current_amount) - data.amount
        to_pot.current_amount = float(to_pot.current_amount) + data.amount

        await self.db.flush()
        await self.db.refresh(from_pot)
        await self.db.refresh(to_pot)

        return from_pot, to_pot
