"""Expenses API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Query

from app.api.deps import CurrentUserId, DbSession
from app.schemas.expense import (
    ExpenseCategory,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummary,
    ExpenseUpdate,
)
from app.services.expense_service import ExpenseService

router = APIRouter()


@router.get("/", response_model=list[ExpenseResponse])
async def list_expenses(
    user_id: CurrentUserId,
    db: DbSession,
    pot_id: UUID | None = Query(None, alias="potId"),
    category: ExpenseCategory | None = None,
    start_date: datetime | None = Query(None, alias="startDate"),
    end_date: datetime | None = Query(None, alias="endDate"),
    recurring: bool | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> list[ExpenseResponse]:
    """List expenses with optional filters."""
    service = ExpenseService(db)
    expenses = await service.list_for_user(
        user_id,
        pot_id=pot_id,
        category=category,
        start_date=start_date,
        end_date=end_date,
        recurring=recurring,
        limit=limit,
        offset=offset,
    )
    return [ExpenseResponse.model_validate(expense) for expense in expenses]


@router.post("/", response_model=ExpenseResponse, status_code=201)
async def create_expense(
    data: ExpenseCreate,
    user_id: CurrentUserId,
    db: DbSession,
) -> ExpenseResponse:
    """Record a new expense."""
    service = ExpenseService(db)
    expense = await service.create(user_id, data)
    return ExpenseResponse.model_validate(expense)


@router.get("/summary", response_model=ExpenseSummary)
async def get_expense_summary(
    user_id: CurrentUserId,
    db: DbSession,
    start_date: datetime = Query(..., alias="startDate"),
    end_date: datetime = Query(..., alias="endDate"),
) -> ExpenseSummary:
    """Get expense summary by category for a period."""
    service = ExpenseService(db)
    summary = await service.get_summary(user_id, start_date, end_date)
    return summary


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> ExpenseResponse:
    """Get a specific expense."""
    service = ExpenseService(db)
    expense = await service.get_by_id(expense_id, user_id)
    return ExpenseResponse.model_validate(expense)


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: UUID,
    data: ExpenseUpdate,
    user_id: CurrentUserId,
    db: DbSession,
) -> ExpenseResponse:
    """Update an expense."""
    service = ExpenseService(db)
    expense = await service.get_by_id(expense_id, user_id)
    updated_expense = await service.update(expense, data)
    return ExpenseResponse.model_validate(updated_expense)


@router.delete("/{expense_id}", status_code=204)
async def delete_expense(
    expense_id: UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> None:
    """Delete an expense."""
    service = ExpenseService(db)
    expense = await service.get_by_id(expense_id, user_id)
    await service.delete(expense)
