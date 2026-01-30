"""User schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.schemas.pot import PotCategory


class UserBase(BaseModel):
    """Base user schema."""

    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a user."""

    pass


class UserUpdate(BaseModel):
    """Schema for updating a user."""

    name: str | None = Field(None, min_length=1, max_length=255)
    email: EmailStr | None = None
    avatar: str | None = None
    monthly_income: float | None = Field(None, ge=0)
    currency: str | None = Field(None, min_length=3, max_length=3)


class UserResponse(BaseModel):
    """Schema for user response."""

    id: UUID
    name: str
    email: str
    avatar: str | None = None
    monthly_income: float = Field(alias="monthlyIncome")
    currency: str
    onboarding_completed: bool = Field(alias="onboardingCompleted")
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class OnboardingPotAllocation(BaseModel):
    """Schema for pot allocation during onboarding."""

    name: str
    category: PotCategory
    percentage: float = Field(..., ge=0, le=100)
    color: str = "#6366f1"
    icon: str = "wallet"


class OnboardingData(BaseModel):
    """Schema for completing onboarding."""

    name: str = Field(..., min_length=1, max_length=255)
    monthly_income: float = Field(..., ge=0, alias="monthlyIncome")
    currency: str = Field(default="USD", min_length=3, max_length=3)
    pots: list[OnboardingPotAllocation] = Field(..., min_length=1)

    model_config = {"populate_by_name": True}
