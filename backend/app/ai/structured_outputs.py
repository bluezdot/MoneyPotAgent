"""Structured output schemas for AI responses."""

from pydantic import BaseModel, Field


class PotImpactOutput(BaseModel):
    """Structured output for pot impact."""

    pot_name: str
    current_amount: float
    projected_amount: float
    change: float
    percentage_of_pot: float


class GoalImpactOutput(BaseModel):
    """Structured output for goal impact."""

    goal_title: str
    current_progress_percent: float
    delay_days: int | None = None
    impact_description: str


class ImpactAnalysisOutput(BaseModel):
    """Structured output for impact analysis."""

    summary: str
    affected_pots: list[PotImpactOutput]
    affected_goals: list[GoalImpactOutput]
    recommendation: str
    severity: str = Field(description="low, medium, or high")


class TradeOffOptionOutput(BaseModel):
    """Structured output for a trade-off option."""

    title: str
    description: str
    savings: float
    feasibility: str = Field(description="easy, moderate, or difficult")
    recommended: bool = False


class TradeOffAnalysisOutput(BaseModel):
    """Structured output for trade-off analysis."""

    situation_summary: str
    options: list[TradeOffOptionOutput]
    best_option_reasoning: str


class InsightOutput(BaseModel):
    """Structured output for a financial insight."""

    title: str
    description: str
    insight_type: str = Field(description="tip, warning, or achievement")
    priority: str = Field(description="low, medium, or high")
    action_item: str | None = None
