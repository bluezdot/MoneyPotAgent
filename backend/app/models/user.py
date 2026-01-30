"""User model."""

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.chat import ChatSession
    from app.models.pot import Pot


class User(Base, UUIDMixin, TimestampMixin):
    """User model representing app users."""

    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    avatar: Mapped[str | None] = mapped_column(String(500), nullable=True)
    monthly_income: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    pots: Mapped[list["Pot"]] = relationship(
        "Pot",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        "ChatSession",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
