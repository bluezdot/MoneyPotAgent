"""Pot model."""

import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.expense import Expense
    from app.models.goal import Goal
    from app.models.user import User


class PotCategory(str, enum.Enum):
    """Categories for money pots."""

    NECESSITIES = "necessities"
    WANTS = "wants"
    SAVINGS = "savings"
    INVESTMENTS = "investments"
    EMERGENCY = "emergency"


class Pot(Base, UUIDMixin, TimestampMixin):
    """Pot model representing money allocation buckets."""

    __tablename__ = "pots"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[PotCategory] = mapped_column(
        Enum(PotCategory, name="pot_category"),
        nullable=False,
    )
    percentage: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    current_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    target_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    color: Mapped[str] = mapped_column(String(7), default="#6366f1")
    icon: Mapped[str] = mapped_column(String(50), default="wallet")

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="pots")
    goals: Mapped[list["Goal"]] = relationship(
        "Goal",
        back_populates="pot",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    expenses: Mapped[list["Expense"]] = relationship(
        "Expense",
        back_populates="pot",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
