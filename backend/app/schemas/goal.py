"""Goal and Milestone schemas."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class GoalPriority(str, Enum):
    """Priority levels for goals."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class GoalStatus(str, Enum):
    """Status for goals."""

    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"


class MilestoneBase(BaseModel):
    """Base milestone schema."""

    title: str = Field(..., min_length=1, max_length=255)
    target_amount: float = Field(..., gt=0, alias="targetAmount")

    model_config = {"populate_by_name": True}


class MilestoneCreate(MilestoneBase):
    """Schema for creating a milestone."""

    pass


class MilestoneUpdate(BaseModel):
    """Schema for updating a milestone."""

    title: str | None = Field(None, min_length=1, max_length=255)
    target_amount: float | None = Field(None, gt=0, alias="targetAmount")
    completed: bool | None = None

    model_config = {"populate_by_name": True}


class MilestoneResponse(BaseModel):
    """Schema for milestone response."""

    id: UUID
    title: str
    target_amount: float = Field(alias="targetAmount")
    completed: bool
    completed_at: datetime | None = Field(None, alias="completedAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class GoalBase(BaseModel):
    """Base goal schema."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    target_amount: float = Field(..., gt=0, alias="targetAmount")
    deadline: datetime | None = None
    priority: GoalPriority = GoalPriority.MEDIUM


class GoalCreate(GoalBase):
    """Schema for creating a goal."""

    pot_id: UUID = Field(..., alias="potId")
    milestones: list[MilestoneCreate] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class GoalUpdate(BaseModel):
    """Schema for updating a goal."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    target_amount: float | None = Field(None, gt=0, alias="targetAmount")
    deadline: datetime | None = None
    priority: GoalPriority | None = None
    status: GoalStatus | None = None

    model_config = {"populate_by_name": True}


class GoalResponse(BaseModel):
    """Schema for goal response."""

    id: UUID
    title: str
    description: str | None = None
    target_amount: float = Field(alias="targetAmount")
    current_amount: float = Field(alias="currentAmount")
    deadline: datetime | None = None
    priority: GoalPriority
    status: GoalStatus
    pot_id: UUID = Field(alias="potId")
    milestones: list[MilestoneResponse] = Field(default_factory=list)
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class GoalContribution(BaseModel):
    """Schema for contributing funds to a goal."""

    amount: float = Field(..., gt=0)
