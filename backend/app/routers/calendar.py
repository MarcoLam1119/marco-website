from fastapi import APIRouter, Form, Depends, HTTPException, Request
from typing import Optional
from datetime import date, time
from app.models.calendarEventModels import CalendarEventModel
from app.services.loginDTO import validate_admin_token, get_optional_token, try_get_user_info
from app.services.calendarDTO import (
    add_event_logic,
    get_event_logic,
    list_event_logic,
    list_event_login_logic,
    update_event_logic,
    delete_event_logic,
)

router = APIRouter(prefix="/calendar", tags=["Calendar"])

@router.post("/add")
async def add_event(
    event_name: str = Form(...),
    event_description: str = Form(...),
    start_date: date = Form(...),
    end_date: date = Form(...),
    is_full_day: bool = Form(...),
    start_time: Optional[time] = Form(None),
    end_time: Optional[time] = Form(None),
    is_publish: bool = Form(...),
    user_info: dict = Depends(validate_admin_token)
):
    event_data = CalendarEventModel(
        id=None,
        event_name=event_name,
        event_description=event_description,
        start_date=start_date,
        end_date=end_date,
        is_full_day=is_full_day,
        start_time=start_time,
        end_time=end_time,
        is_publish=is_publish,
        is_delete=False
    )
    return await add_event_logic(event_data)

@router.get("/list")
def list_event(request: Request):
    token = get_optional_token(request)
    user_info = try_get_user_info(token)

    if user_info and user_info["role"] == "admin":
        return list_event_login_logic()
    else:
        return list_event_logic()

@router.get("/get/{event_id}")
def get_event(event_id: int, user_info: dict = Depends(validate_admin_token)):
    return get_event_logic(event_id)

@router.post("/update/{event_id}")
async def update_event(
    event_id: int,
    event_name: str = Form(...),
    event_description: str = Form(...),
    start_date: date = Form(...),
    end_date: date = Form(...),
    is_full_day: bool = Form(...),
    start_time: Optional[time] = Form(None),
    end_time: Optional[time] = Form(None),
    is_publish: bool = Form(...),
    user_info: dict = Depends(validate_admin_token)
):
    event_data = CalendarEventModel(
        event_id=event_id,
        event_name=event_name,
        event_description=event_description,
        start_date=start_date,
        end_date=end_date,
        is_full_day=is_full_day,
        start_time=start_time,
        end_time=end_time,
        is_publish=is_publish,
        is_delete=False
    )
    return await update_event_logic(event_id, event_data)

@router.post("/delete/{event_id}")
async def delete_event(event_id: int, user_info: dict = Depends(validate_admin_token)):
    return await delete_event_logic(event_id)