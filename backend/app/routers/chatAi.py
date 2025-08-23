# app/routers/chat.py
from fastapi import APIRouter, HTTPException
from app.schemas import ChatRequest, ChatResponse
from app.services.poe_client import (
    get_bot_response_sync_with_history,
    commit_assistant_reply,
)
import uuid

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def post_chat(req: ChatRequest):
    """
    Continues a conversation identified by conversation_id.
    If conversation_id is missing/empty/null, a new conversation is started.
    """
    try:
        # Start a new conversation if conversation_id is null/empty
        conv_id = (req.conversation_id or "").strip() or str(uuid.uuid4())

        chunks: list[str] = []
        for event in get_bot_response_sync_with_history(
            conversation_id=conv_id,
            user_message=req.message,
        ):
            text = getattr(event, "text", None)
            if isinstance(text, str):
                chunks.append(text)
        reply = "".join(chunks)

        # Persist this turn (user + assistant)
        commit_assistant_reply(conv_id, req.message, reply)

        return ChatResponse(reply=reply, conversation_id=conv_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Poe API error: {str(e)}")