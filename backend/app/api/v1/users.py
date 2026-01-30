"""Users API endpoints."""

from fastapi import APIRouter, Depends

from app.api.deps import CurrentOrNewUser, DbSession
from app.schemas.user import OnboardingData, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user: CurrentOrNewUser,
) -> UserResponse:
    """Get current user profile."""
    return UserResponse.model_validate(user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    data: UserUpdate,
    user: CurrentOrNewUser,
    db: DbSession,
) -> UserResponse:
    """Update current user profile."""
    service = UserService(db)
    updated_user = await service.update(user, data)
    return UserResponse.model_validate(updated_user)


@router.post("/me/onboarding", response_model=UserResponse)
async def complete_onboarding(
    data: OnboardingData,
    user: CurrentOrNewUser,
    db: DbSession,
) -> UserResponse:
    """Complete user onboarding with pot allocations."""
    service = UserService(db)
    updated_user = await service.complete_onboarding(user, data)
    return UserResponse.model_validate(updated_user)
