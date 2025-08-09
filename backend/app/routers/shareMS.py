from fastapi import APIRouter, Form, Depends, HTTPException, Request
from typing import Optional
from datetime import date, time
from app.services.loginDTO import validate_admin_token, get_optional_token, try_get_user_info
from app.services.shareMSDTO import (
    add_message_logic,
    get_message_logic,
    list_message_logic,
    update_message_logic,
    delete_message_logic,
)

router = APIRouter(prefix="/message", tags=["Message"])

@router.post("/add")
async def add_message(
    message_content: str = Form(...),
):
    return await add_message_logic(message_content)

@router.get("/list")
def list_message():
    return list_message_logic()

@router.post("/update/{message_id}")
async def update_message(
    message_id: int,
    message_content: str = Form(...),
):
    try:
        return await update_message_logic(message_id, message_content)
    except HTTPException as e:
        raise e  # Re-raise the HTTPException to return the correct response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update message: {str(e)}")

@router.post("/delete/{message_id}")
async def delete_message(message_id: int):
    try:
        return await delete_message_logic(message_id)
    except HTTPException as e:
        raise e  # Re-raise the HTTPException to return the correct response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete message: {str(e)}")


@router.get("/get/latest")
def get_latest_message():
    message_list = list_message_logic()
    return message_list[-1]["message_content"]

@router.get("/get/latest/7")
def get_latest_message():
    message_list = list_message_logic()
    latest_messages = message_list[-7:]  
    return [message["message_content"] for message in latest_messages if "message_content" in message]

@router.get("/get/latest/10")
def get_latest_message():
    message_list = list_message_logic()
    # Get the last 10 messages, or all if there are fewer than 10
    latest_messages = message_list[-10:]  
    # Create a dictionary with message content as both keys and values
    formatted_messages = {message["message_content"]: message for message in latest_messages if "message_content" in message}
    return formatted_messages