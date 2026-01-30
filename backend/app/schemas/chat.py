"""Chat schemas."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    """Role of the message sender."""

    USER = "user"
    ASSISTANT = "assistant"


class MessageType(str, Enum):
    """Type of message content."""

    TEXT = "text"
    IMPACT_ANALYSIS = "impact-analysis"
    TRADE_OFF = "trade-off"
    RECOMMENDATION = "recommendation"
    QUICK_ACTIONS = "quick-actions"


class PotImpact(BaseModel):
    """Schema for pot impact in analysis."""

    pot_id: UUID = Field(alias="potId")
    pot_name: str = Field(alias="potName")
    current_amount: float = Field(alias="currentAmount")
    projected_amount: float = Field(alias="projectedAmount")
    change: float

    model_config = {"populate_by_name": True}


class GoalImpact(BaseModel):
    """Schema for goal impact in analysis."""

    goal_id: UUID = Field(alias="goalId")
    goal_title: str = Field(alias="goalTitle")
    current_progress: float = Field(alias="currentProgress")
    projected_progress: float = Field(alias="projectedProgress")
    delay_days: int | None = Field(None, alias="delayDays")

    model_config = {"populate_by_name": True}


class ImpactAnalysis(BaseModel):
    """Schema for impact analysis."""

    action: str
    pot_impacts: list[PotImpact] = Field(alias="potImpacts")
    goal_impacts: list[GoalImpact] = Field(alias="goalImpacts")
    recommendation: str

    model_config = {"populate_by_name": True}


class TradeOffOption(BaseModel):
    """Schema for trade-off option."""

    id: str
    label: str
    impact: str
    recommended: bool = False


class TradeOff(BaseModel):
    """Schema for trade-off analysis."""

    id: str
    title: str
    description: str
    options: list[TradeOffOption]


class QuickAction(BaseModel):
    """Schema for quick action."""

    id: str
    label: str
    icon: str
    action: str


class ChatSessionCreate(BaseModel):
    """Schema for creating a chat session."""

    title: str = Field(default="New Chat", max_length=255)


class ChatSessionResponse(BaseModel):
    """Schema for chat session response."""

    id: UUID
    title: str
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class ChatMessageCreate(BaseModel):
    """Schema for creating a chat message."""

    content: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    """Schema for chat message response."""

    id: UUID
    role: MessageRole
    content: str
    type: MessageType = Field(alias="messageType")
    timestamp: datetime = Field(alias="createdAt")
    impact_analysis: ImpactAnalysis | None = Field(None, alias="impactAnalysis")
    trade_off: TradeOff | None = Field(None, alias="tradeOff")
    quick_actions: list[QuickAction] | None = Field(None, alias="quickActions")

    model_config = {"populate_by_name": True, "from_attributes": True}


class ChatSessionWithMessages(ChatSessionResponse):
    """Schema for chat session with messages."""

    messages: list[ChatMessageResponse] = Field(default_factory=list)
