"""Impact analysis API endpoints."""

from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.api.deps import CurrentUserId, DbSession
from app.schemas.chat import ImpactAnalysis, TradeOff
from app.services.impact_service import ImpactService

router = APIRouter()


class ImpactAnalyzeRequest(BaseModel):
    """Request schema for impact analysis."""

    amount: float = Field(..., gt=0)
    pot_id: UUID | None = Field(None, alias="potId")
    description: str = "Purchase"

    model_config = {"populate_by_name": True}


class TradeOffRequest(BaseModel):
    """Request schema for trade-off generation."""

    amount: float = Field(..., gt=0)
    description: str = "Purchase"


@router.post("/analyze", response_model=ImpactAnalysis)
async def analyze_impact(
    data: ImpactAnalyzeRequest,
    user_id: CurrentUserId,
    db: DbSession,
) -> ImpactAnalysis:
    """Analyze the impact of a potential purchase on pots and goals."""
    service = ImpactService(db)
    return await service.analyze_purchase(
        user_id=user_id,
        amount=data.amount,
        pot_id=data.pot_id,
        description=data.description,
    )


@router.post("/trade-off", response_model=TradeOff)
async def get_trade_offs(
    data: TradeOffRequest,
    user_id: CurrentUserId,
    db: DbSession,
) -> TradeOff:
    """Get trade-off options for a potential purchase."""
    service = ImpactService(db)
    return await service.generate_trade_offs(
        user_id=user_id,
        amount=data.amount,
        description=data.description,
    )
