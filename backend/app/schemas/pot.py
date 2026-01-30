"""Pot schemas."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class PotCategory(str, Enum):
    """Categories for money pots."""

    NECESSITIES = "necessities"
    WANTS = "wants"
    SAVINGS = "savings"
    INVESTMENTS = "investments"
    EMERGENCY = "emergency"


class PotBase(BaseModel):
    """Base pot schema."""

    name: str = Field(..., min_length=1, max_length=255)
    category: PotCategory
    percentage: float = Field(..., ge=0, le=100)
    color: str = Field(default="#6366f1", max_length=7)
    icon: str = Field(default="wallet", max_length=50)


class PotCreate(PotBase):
    """Schema for creating a pot."""

    target_amount: float = Field(default=0, ge=0, alias="targetAmount")

    model_config = {"populate_by_name": True}


class PotUpdate(BaseModel):
    """Schema for updating a pot."""

    name: str | None = Field(None, min_length=1, max_length=255)
    category: PotCategory | None = None
    percentage: float | None = Field(None, ge=0, le=100)
    target_amount: float | None = Field(None, ge=0, alias="targetAmount")
    color: str | None = Field(None, max_length=7)
    icon: str | None = Field(None, max_length=50)

    model_config = {"populate_by_name": True}


class PotResponse(BaseModel):
    """Schema for pot response."""

    id: UUID
    name: str
    category: PotCategory
    percentage: float
    current_amount: float = Field(alias="currentAmount")
    target_amount: float = Field(alias="targetAmount")
    color: str
    icon: str

    model_config = {"populate_by_name": True, "from_attributes": True}


class PotTransfer(BaseModel):
    """Schema for transferring money between pots."""

    to_pot_id: UUID = Field(..., alias="toPotId")
    amount: float = Field(..., gt=0)

    model_config = {"populate_by_name": True}
