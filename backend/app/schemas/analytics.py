"""Analytics schemas."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.expense import ExpenseCategory
from app.schemas.goal import GoalStatus
from app.schemas.pot import PotCategory


class InsightType(str, Enum):
    """Type of AI insight."""

    TIP = "tip"
    WARNING = "warning"
    ACHIEVEMENT = "achievement"


class ChartDataPoint(BaseModel):
    """Schema for chart data point."""

    name: str
    value: float
    fill: str | None = None


class TimeSeriesDataPoint(BaseModel):
    """Schema for time series data point."""

    date: str
    amount: float


class SpendingTrend(BaseModel):
    """Schema for spending trends."""

    data: list[TimeSeriesDataPoint]
    total_this_period: float = Field(alias="totalThisPeriod")
    total_last_period: float = Field(alias="totalLastPeriod")
    change_percentage: float = Field(alias="changePercentage")

    model_config = {"populate_by_name": True}


class PotDistribution(BaseModel):
    """Schema for pot distribution."""

    data: list[ChartDataPoint]
    total_amount: float = Field(alias="totalAmount")

    model_config = {"populate_by_name": True}


class GoalProgressData(BaseModel):
    """Schema for goal progress overview."""

    goal_id: UUID = Field(alias="goalId")
    title: str
    target_amount: float = Field(alias="targetAmount")
    current_amount: float = Field(alias="currentAmount")
    progress_percentage: float = Field(alias="progressPercentage")
    status: GoalStatus
    deadline: datetime | None = None
    days_remaining: int | None = Field(None, alias="daysRemaining")

    model_config = {"populate_by_name": True}


class AIInsight(BaseModel):
    """Schema for AI insight."""

    id: str
    title: str
    description: str
    type: InsightType
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True}


class DashboardData(BaseModel):
    """Schema for main dashboard data."""

    total_balance: float = Field(alias="totalBalance")
    monthly_income: float = Field(alias="monthlyIncome")
    total_expenses_this_month: float = Field(alias="totalExpensesThisMonth")
    savings_rate: float = Field(alias="savingsRate")
    pot_distribution: list[ChartDataPoint] = Field(alias="potDistribution")
    spending_by_category: list[ChartDataPoint] = Field(alias="spendingByCategory")
    active_goals_count: int = Field(alias="activeGoalsCount")
    completed_goals_count: int = Field(alias="completedGoalsCount")

    model_config = {"populate_by_name": True}
