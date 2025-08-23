# app/schemas.py
from typing import Optional
from pydantic import BaseModel, Field, validator


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to send to the Poe bot.")
    conversation_id: Optional[str] = Field(
        None,
        description="ID for the chatroom/session. If null or empty, a new conversation will be created.",
    )

    @validator("message")
    def non_empty_message(cls, v: str):
        if not v.strip():
            raise ValueError("message cannot be empty")
        return v


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str