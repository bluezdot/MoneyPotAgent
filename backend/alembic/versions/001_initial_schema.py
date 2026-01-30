"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-01-31

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enums
    pot_category = postgresql.ENUM(
        "necessities", "wants", "savings", "investments", "emergency",
        name="pot_category",
        create_type=True,
    )
    pot_category.create(op.get_bind(), checkfirst=True)

    goal_priority = postgresql.ENUM(
        "high", "medium", "low",
        name="goal_priority",
        create_type=True,
    )
    goal_priority.create(op.get_bind(), checkfirst=True)

    goal_status = postgresql.ENUM(
        "active", "completed", "paused",
        name="goal_status",
        create_type=True,
    )
    goal_status.create(op.get_bind(), checkfirst=True)

    expense_category = postgresql.ENUM(
        "food", "transport", "utilities", "entertainment",
        "shopping", "health", "education", "other",
        name="expense_category",
        create_type=True,
    )
    expense_category.create(op.get_bind(), checkfirst=True)

    message_role = postgresql.ENUM(
        "user", "assistant",
        name="message_role",
        create_type=True,
    )
    message_role.create(op.get_bind(), checkfirst=True)

    message_type = postgresql.ENUM(
        "text", "impact-analysis", "trade-off", "recommendation", "quick-actions",
        name="message_type",
        create_type=True,
    )
    message_type.create(op.get_bind(), checkfirst=True)

    # Create users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("avatar", sa.String(500), nullable=True),
        sa.Column("monthly_income", sa.Numeric(12, 2), default=0),
        sa.Column("currency", sa.String(3), default="USD"),
        sa.Column("onboarding_completed", sa.Boolean, default=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )

    # Create pots table
    op.create_table(
        "pots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category", pot_category, nullable=False),
        sa.Column("percentage", sa.Numeric(5, 2), default=0),
        sa.Column("current_amount", sa.Numeric(12, 2), default=0),
        sa.Column("target_amount", sa.Numeric(12, 2), default=0),
        sa.Column("color", sa.String(7), default="#6366f1"),
        sa.Column("icon", sa.String(50), default="wallet"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_pots_user_id", "pots", ["user_id"])

    # Create goals table
    op.create_table(
        "goals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "pot_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("pots.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("target_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("current_amount", sa.Numeric(12, 2), default=0),
        sa.Column("deadline", sa.DateTime(timezone=True), nullable=True),
        sa.Column("priority", goal_priority, default="medium"),
        sa.Column("status", goal_status, default="active"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_goals_pot_id", "goals", ["pot_id"])

    # Create milestones table
    op.create_table(
        "milestones",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "goal_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("goals.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("target_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("completed", sa.Boolean, default=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_milestones_goal_id", "milestones", ["goal_id"])

    # Create expenses table
    op.create_table(
        "expenses",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "pot_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("pots.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("description", sa.String(500), nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("category", expense_category, nullable=False),
        sa.Column("date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("recurring", sa.Boolean, default=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_expenses_pot_id", "expenses", ["pot_id"])
    op.create_index("ix_expenses_date", "expenses", ["date"])
    op.create_index("ix_expenses_category", "expenses", ["category"])

    # Create chat_sessions table
    op.create_table(
        "chat_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(255), default="New Chat"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_chat_sessions_user_id", "chat_sessions", ["user_id"])

    # Create chat_messages table
    op.create_table(
        "chat_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "session_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("chat_sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("role", message_role, nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("message_type", message_type, default="text"),
        sa.Column("metadata", postgresql.JSON, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_chat_messages_session_id", "chat_messages", ["session_id"])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table("chat_messages")
    op.drop_table("chat_sessions")
    op.drop_table("expenses")
    op.drop_table("milestones")
    op.drop_table("goals")
    op.drop_table("pots")
    op.drop_table("users")

    # Drop enums
    op.execute("DROP TYPE IF EXISTS message_type")
    op.execute("DROP TYPE IF EXISTS message_role")
    op.execute("DROP TYPE IF EXISTS expense_category")
    op.execute("DROP TYPE IF EXISTS goal_status")
    op.execute("DROP TYPE IF EXISTS goal_priority")
    op.execute("DROP TYPE IF EXISTS pot_category")
