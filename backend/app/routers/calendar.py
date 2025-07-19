# TODO rounte to 
#app.router("/calendar/...")

from fastapi import APIRouter, UploadFile, Form, File

from app.services.calendarDTO import get_event, list_event, add_event, delete_event, update_event

router = APIRouter(
    prefix="/calendar",
    tags=["calendar"],
)

@router.post("/add")
async def add_event(
    name: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...)
):
    return await add_photo_logic(name, category_id, file)

@router.get("/list")
def list_calendar():
    return list_event()

@router.get("/select/{event_id}")
def get_event(event_id):
    return get_event(event_id)
    
@router.post("/update/{event_id}")
def update_event:
	return update_event(event_id)

@router.post("/delete/{event_id}")
def delete_event(event_id: int):
    return delete_event(event_id)
    
    
    
    
    