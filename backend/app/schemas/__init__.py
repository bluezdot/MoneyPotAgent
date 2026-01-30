"""Pydantic schemas."""

from app.schemas.analytics import (
    AIInsight,
    ChartDataPoint,
    DashboardData,
    GoalProgressData,
    InsightType,
    PotDistribution,
    SpendingTrend,
    TimeSeriesDataPoint,
)
from app.schemas.chat import (
    ChatMessageCreate,
    ChatMessageResponse,
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionWithMessages,
    ImpactAnalysis,
    MessageRole,
    MessageType,
    PotImpact,
    GoalImpact,
    QuickAction,
    TradeOff,
    TradeOffOption,
)
from app.schemas.expense import (
    ExpenseCategory,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummary,
    ExpenseUpdate,
)
from app.schemas.goal import (
    GoalContribution,
    GoalCreate,
    GoalPriority,
    GoalResponse,
    GoalStatus,
    GoalUpdate,
    MilestoneCreate,
    MilestoneResponse,
    MilestoneUpdate,
)
from app.schemas.pot import (
    PotCategory,
    PotCreate,
    PotResponse,
    PotTransfer,
    PotUpdate,
)
from app.schemas.user import (
    OnboardingData,
    OnboardingPotAllocation,
    UserCreate,
    UserResponse,
    UserUpdate,
)

__all__ = [
    # User
    "UserCreate",
    "UserResponse",
    "UserUpdate",
    "OnboardingData",
    "OnboardingPotAllocation",
    # Pot
    "PotCategory",
    "PotCreate",
    "PotResponse",
    "PotUpdate",
    "PotTransfer",
    # Goal
    "GoalPriority",
    "GoalStatus",
    "GoalCreate",
    "GoalResponse",
    "GoalUpdate",
    "GoalContribution",
    "MilestoneCreate",
    "MilestoneResponse",
    "MilestoneUpdate",
    # Expense
    "ExpenseCategory",
    "ExpenseCreate",
    "ExpenseResponse",
    "ExpenseUpdate",
    "ExpenseSummary",
    # Chat
    "MessageRole",
    "MessageType",
    "ChatSessionCreate",
    "ChatSessionResponse",
    "ChatSessionWithMessages",
    "ChatMessageCreate",
    "ChatMessageResponse",
    "ImpactAnalysis",
    "PotImpact",
    "GoalImpact",
    "QuickAction",
    "TradeOff",
    "TradeOffOption",
    # Analytics
    "DashboardData",
    "SpendingTrend",
    "PotDistribution",
    "GoalProgressData",
    "AIInsight",
    "InsightType",
    "ChartDataPoint",
    "TimeSeriesDataPoint",
]
