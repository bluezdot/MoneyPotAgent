"""Chat API endpoints with SSE streaming."""

import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sse_starlette.sse import EventSourceResponse

from app.ai.coach import AICoach
from app.api.deps import CurrentUserId, DbSession
from app.core.exceptions import NotFoundException
from app.models.chat import ChatMessage, ChatSession
from app.models.chat import MessageRole as MessageRoleModel
from app.models.chat import MessageType as MessageTypeModel
from app.schemas.chat import (
    ChatMessageCreate,
    ChatMessageResponse,
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionWithMessages,
)

router = APIRouter()


@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    user_id: CurrentUserId,
    db: DbSession,
) -> list[ChatSessionResponse]:
    """List all chat sessions for the current user."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == user_id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = list(result.scalars().all())
    return [ChatSessionResponse.model_validate(session) for session in sessions]


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
async def create_session(
    data: ChatSessionCreate,
    user_id: CurrentUserId,
    db: DbSession,
) -> ChatSessionResponse:
    """Create a new chat session."""
    session = ChatSession(
        user_id=user_id,
        title=data.title,
    )
    db.add(session)
    await db.flush()
    await db.refresh(session)
    return ChatSessionResponse.model_validate(session)


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_session(
    session_id: uuid.UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> ChatSessionWithMessages:
    """Get a chat session with all messages."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.id == session_id, ChatSession.user_id == user_id)
        .options(selectinload(ChatSession.messages))
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException("Chat session")

    # Convert messages to response format
    messages = []
    for msg in session.messages:
        msg_response = ChatMessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            messageType=msg.message_type,
            createdAt=msg.created_at,
            impactAnalysis=msg.extra_data.get("impactAnalysis") if msg.extra_data else None,
            tradeOff=msg.extra_data.get("tradeOff") if msg.extra_data else None,
            quickActions=msg.extra_data.get("quickActions") if msg.extra_data else None,
        )
        messages.append(msg_response)

    return ChatSessionWithMessages(
        id=session.id,
        title=session.title,
        createdAt=session.created_at,
        messages=messages,
    )


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: uuid.UUID,
    user_id: CurrentUserId,
    db: DbSession,
) -> None:
    """Delete a chat session."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException("Chat session")

    await db.delete(session)
    await db.flush()


@router.post("/sessions/{session_id}/messages")
async def send_message(
    session_id: uuid.UUID,
    data: ChatMessageCreate,
    user_id: CurrentUserId,
    db: DbSession,
):
    """Send a message and get a streaming AI response."""
    # Verify session exists and belongs to user
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException("Chat session")

    # Save user message
    user_message = ChatMessage(
        session_id=session_id,
        role=MessageRoleModel.USER,
        content=data.content,
        message_type=MessageTypeModel.TEXT,
    )
    db.add(user_message)
    await db.flush()

    # Update session title if it's the first message
    messages_count = await db.execute(
        select(ChatMessage).where(ChatMessage.session_id == session_id)
    )
    if len(list(messages_count.scalars().all())) == 1:
        # Generate title from first message
        title = data.content[:50] + "..." if len(data.content) > 50 else data.content
        session.title = title
        await db.flush()

    # Create AI coach
    coach = AICoach(db)

    async def generate():
        """Generate SSE events for the streaming response."""
        response_content = []
        message_id = uuid.uuid4()

        try:
            # Stream the AI response
            async for chunk in coach.generate_response(user_id, session_id, data.content):
                response_content.append(chunk)
                yield {
                    "event": "message",
                    "data": json.dumps({
                        "id": str(message_id),
                        "chunk": chunk,
                    }),
                }

            # Save the complete assistant message
            full_response = "".join(response_content)
            assistant_message = ChatMessage(
                id=message_id,
                session_id=session_id,
                role=MessageRoleModel.ASSISTANT,
                content=full_response,
                message_type=MessageTypeModel.TEXT,
            )
            db.add(assistant_message)
            await db.flush()

            # Generate quick actions
            quick_actions = await coach.generate_quick_actions(user_id)

            # Send completion event
            yield {
                "event": "done",
                "data": json.dumps({
                    "id": str(message_id),
                    "quickActions": quick_actions,
                }),
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(generate())
