"""Expense schemas."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class ExpenseCategory(str, Enum):
    """Categories for expenses."""

    FOOD = "food"
    TRANSPORT = "transport"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    HEALTH = "health"
    EDUCATION = "education"
    OTHER = "other"


class ExpenseBase(BaseModel):
    """Base expense schema."""

    description: str = Field(..., min_length=1, max_length=500)
    amount: float = Field(..., gt=0)
    category: ExpenseCategory
    date: datetime
    recurring: bool = False
    notes: str | None = None


class ExpenseCreate(ExpenseBase):
    """Schema for creating an expense."""

    pot_id: UUID = Field(..., alias="potId")

    model_config = {"populate_by_name": True}


class ExpenseUpdate(BaseModel):
    """Schema for updating an expense."""

    description: str | None = Field(None, min_length=1, max_length=500)
    amount: float | None = Field(None, gt=0)
    category: ExpenseCategory | None = None
    date: datetime | None = None
    recurring: bool | None = None
    notes: str | None = None
    pot_id: UUID | None = Field(None, alias="potId")

    model_config = {"populate_by_name": True}


class ExpenseResponse(BaseModel):
    """Schema for expense response."""

    id: UUID
    description: str
    amount: float
    category: ExpenseCategory
    pot_id: UUID = Field(alias="potId")
    date: datetime
    recurring: bool
    notes: str | None = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class ExpenseSummary(BaseModel):
    """Schema for expense summary."""

    total: float
    by_category: dict[ExpenseCategory, float] = Field(alias="byCategory")
    period_start: datetime = Field(alias="periodStart")
    period_end: datetime = Field(alias="periodEnd")

    model_config = {"populate_by_name": True}
