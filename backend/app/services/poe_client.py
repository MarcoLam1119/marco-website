# app/services/poe_client.py
import os
from typing import Iterable, List, Tuple

import fastapi_poe as fp

POE_API_KEY = os.getenv("POE_API_KEY", "nMbO2FpuSKs4ZBEuvQP-lh_iBERpVW8ptuizCq8oTXY")
DEFAULT_BOT_NAME = os.getenv("POE_BOT_NAME", "Assistant")

# Simple in-memory store: {conversation_id: List[Tuple[role, content]]}
_CONVERSATIONS: dict[str, List[Tuple[str, str]]] = {}

MAX_TURNS = int(os.getenv("MAX_TURNS", "40"))


def _get_history(conversation_id: str) -> List[Tuple[str, str]]:
    return _CONVERSATIONS.get(conversation_id, []).copy()


def _save_turns(conversation_id: str, new_turns: List[Tuple[str, str]]) -> None:
    history = _CONVERSATIONS.get(conversation_id, [])
    history.extend(new_turns)
    if len(history) > MAX_TURNS:
        history = history[-MAX_TURNS:]
    _CONVERSATIONS[conversation_id] = history


def get_bot_response_sync_with_history(
    conversation_id: str,
    user_message: str,
    bot_name: str = DEFAULT_BOT_NAME,
) -> Iterable[fp.PartialResponse]:
    """
    Returns PartialResponse events while preserving conversation state per conversation_id.
    """
    messages: List[fp.ProtocolMessage] = []
    for role, content in _get_history(conversation_id):
        # Map legacy 'assistant' role to 'bot' to satisfy ProtocolMessage constraints
        normalized_role = "bot" if role == "assistant" else role
        messages.append(fp.ProtocolMessage(role=normalized_role, content=content))

    messages.append(fp.ProtocolMessage(role="user", content=user_message))

    return fp.get_bot_response_sync(
        messages=messages,
        bot_name=bot_name,
        api_key=POE_API_KEY,
    )


def commit_assistant_reply(conversation_id: str, user_message: str, assistant_reply: str) -> None:
    """
    Persist the new user and assistant turns.
    Note: store assistant as 'bot' (not 'assistant').
    """
    _save_turns(
        conversation_id,
        [
            ("user", user_message),
            ("bot", assistant_reply),  # <-- was 'assistant', must be 'bot'
        ],
    )