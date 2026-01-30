"""Pots API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import CurrentUserId, DbSession
from app.schemas.pot import PotCreate, PotResponse, PotTransfer, PotUpdate
from app.services.pot_service import PotService

router = APIRouter()


@router.get("/", response_model=list[PotResponse])
async def list_pots(
    user_id: CurrentUserId,
    db: DbSession,
) -> list[PotResponse]:
    """List all pots for the current user."""
    service = PotService(db)
    pots = await service.list_for_user(user_id)
    return [PotResponse.model_validate(pot) for pot in pots]


@router.post("/", response_model=PotResponse, status_code=201)
async def create_pot(
    data: PotCreate,
    user_id: CurrentUserId,
    db: DbSession,
) -> PotResponse:
    """Create a new pot."""
    service = PotService(db)
    pot = await service.create(user_id, data)
    return PotResponse.model_validate(pot)


@router.get("/{pot_id}", response_model=PotResponse)
async def get_pot(
    pot_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> PotResponse:
    """Get a specific pot."""
    service = PotService(db)
    pot = await service.get_by_id(pot_id, user_id)
    return PotResponse.model_validate(pot)


@router.put("/{pot_id}", response_model=PotResponse)
async def update_pot(
    pot_id: UUID,
    data: PotUpdate,
    user_id: CurrentUserId,
    db: DbSession,
) -> PotResponse:
    """Update a pot."""
    service = PotService(db)
    pot = await service.get_by_id(pot_id, user_id)
    updated_pot = await service.update(pot, data)
    return PotResponse.model_validate(updated_pot)


@router.delete("/{pot_id}", status_code=204)
async def delete_pot(
    pot_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> None:
    """Delete a pot."""
    service = PotService(db)
    pot = await service.get_by_id(pot_id, user_id)
    await service.delete(pot)


@router.post("/{pot_id}/transfer", response_model=dict)
async def transfer_between_pots(
    pot_id: UUID,
    data: PotTransfer,
    user_id: CurrentUserId,
    db: DbSession,
) -> dict:
    """Transfer money between pots."""
    service = PotService(db)
    from_pot = await service.get_by_id(pot_id, user_id)
    from_pot, to_pot = await service.transfer(from_pot, data, user_id)
    return {
        "from_pot": PotResponse.model_validate(from_pot),
        "to_pot": PotResponse.model_validate(to_pot),
    }
