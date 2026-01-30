"""Expense service."""

import uuid
from datetime import datetime

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.expense import Expense
from app.models.expense import ExpenseCategory as ExpenseCategoryModel
from app.models.pot import Pot
from app.schemas.expense import ExpenseCategory, ExpenseCreate, ExpenseSummary, ExpenseUpdate


class ExpenseService:
    """Service for expense operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, expense_id: uuid.UUID, user_id: uuid.UUID) -> Expense:
        """Get expense by ID for a specific user."""
        result = await self.db.execute(
            select(Expense)
            .join(Pot)
            .where(Expense.id == expense_id, Pot.user_id == user_id)
        )
        expense = result.scalar_one_or_none()
        if not expense:
            raise NotFoundException("Expense")
        return expense

    async def list_for_user(
        self,
        user_id: uuid.UUID,
        pot_id: uuid.UUID | None = None,
        category: ExpenseCategory | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        recurring: bool | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Expense]:
        """List expenses for a user with optional filters."""
        query = select(Expense).join(Pot).where(Pot.user_id == user_id)

        if pot_id:
            query = query.where(Expense.pot_id == pot_id)
        if category:
            query = query.where(Expense.category == ExpenseCategoryModel(category.value))
        if start_date:
            query = query.where(Expense.date >= start_date)
        if end_date:
            query = query.where(Expense.date <= end_date)
        if recurring is not None:
            query = query.where(Expense.recurring == recurring)

        query = query.order_by(Expense.date.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, user_id: uuid.UUID, data: ExpenseCreate) -> Expense:
        """Create a new expense."""
        # Verify pot belongs to user
        result = await self.db.execute(
            select(Pot).where(Pot.id == data.pot_id, Pot.user_id == user_id)
        )
        pot = result.scalar_one_or_none()
        if not pot:
            raise NotFoundException("Pot")

        expense = Expense(
            pot_id=data.pot_id,
            description=data.description,
            amount=data.amount,
            category=ExpenseCategoryModel(data.category.value),
            date=data.date,
            recurring=data.recurring,
            notes=data.notes,
        )
        self.db.add(expense)

        # Deduct from pot
        pot.current_amount = float(pot.current_amount) - data.amount

        await self.db.flush()
        await self.db.refresh(expense)
        return expense

    async def update(self, expense: Expense, data: ExpenseUpdate) -> Expense:
        """Update an expense."""
        update_data = data.model_dump(exclude_unset=True, by_alias=False)

        # Handle pot change
        old_amount = expense.amount
        if "pot_id" in update_data and update_data["pot_id"] != expense.pot_id:
            # Return amount to old pot
            old_pot_result = await self.db.execute(
                select(Pot).where(Pot.id == expense.pot_id)
            )
            old_pot = old_pot_result.scalar_one()
            old_pot.current_amount = float(old_pot.current_amount) + old_amount

            # Deduct from new pot
            new_pot_result = await self.db.execute(
                select(Pot).where(Pot.id == update_data["pot_id"])
            )
            new_pot = new_pot_result.scalar_one()
            new_amount = update_data.get("amount", old_amount)
            new_pot.current_amount = float(new_pot.current_amount) - new_amount
        elif "amount" in update_data:
            # Just update amount in current pot
            pot_result = await self.db.execute(
                select(Pot).where(Pot.id == expense.pot_id)
            )
            pot = pot_result.scalar_one()
            amount_diff = update_data["amount"] - old_amount
            pot.current_amount = float(pot.current_amount) - amount_diff

        for field, value in update_data.items():
            if field == "category" and value is not None:
                value = ExpenseCategoryModel(value.value)
            setattr(expense, field, value)

        await self.db.flush()
        await self.db.refresh(expense)
        return expense

    async def delete(self, expense: Expense) -> None:
        """Delete an expense and restore amount to pot."""
        # Restore amount to pot
        pot_result = await self.db.execute(
            select(Pot).where(Pot.id == expense.pot_id)
        )
        pot = pot_result.scalar_one()
        pot.current_amount = float(pot.current_amount) + float(expense.amount)

        await self.db.delete(expense)
        await self.db.flush()

    async def get_summary(
        self,
        user_id: uuid.UUID,
        start_date: datetime,
        end_date: datetime,
    ) -> ExpenseSummary:
        """Get expense summary for a period."""
        # Get total
        total_result = await self.db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0))
            .join(Pot)
            .where(
                Pot.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date,
            )
        )
        total = float(total_result.scalar() or 0)

        # Get by category
        category_result = await self.db.execute(
            select(Expense.category, func.sum(Expense.amount))
            .join(Pot)
            .where(
                Pot.user_id == user_id,
                Expense.date >= start_date,
                Expense.date <= end_date,
            )
            .group_by(Expense.category)
        )

        by_category = {
            ExpenseCategory(row[0].value): float(row[1])
            for row in category_result.all()
        }

        return ExpenseSummary(
            total=total,
            by_category=by_category,
            period_start=start_date,
            period_end=end_date,
        )
