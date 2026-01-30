"""Goal and Milestone models."""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.pot import Pot


class GoalPriority(str, enum.Enum):
    """Priority levels for goals."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class GoalStatus(str, enum.Enum):
    """Status for goals."""

    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"


class Goal(Base, UUIDMixin, TimestampMixin):
    """Goal model representing financial goals."""

    __tablename__ = "goals"

    pot_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pots.id", ondelete="CASCADE"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    target_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    current_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    priority: Mapped[GoalPriority] = mapped_column(
        Enum(GoalPriority, name="goal_priority"),
        default=GoalPriority.MEDIUM,
    )
    status: Mapped[GoalStatus] = mapped_column(
        Enum(GoalStatus, name="goal_status"),
        default=GoalStatus.ACTIVE,
    )

    # Relationships
    pot: Mapped["Pot"] = relationship("Pot", back_populates="goals")
    milestones: Mapped[list["Milestone"]] = relationship(
        "Milestone",
        back_populates="goal",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class Milestone(Base, UUIDMixin, TimestampMixin):
    """Milestone model representing sub-goals."""

    __tablename__ = "milestones"

    goal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    goal: Mapped["Goal"] = relationship("Goal", back_populates="milestones")
