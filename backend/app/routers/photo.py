from fastapi import APIRouter, UploadFile, Form, File

from app.services.photoDTO import add_photo_logic, list_photos_logic, remove_photo_logic

router = APIRouter(
    prefix="/photos",
    tags=["photos"],
)

@router.post("/add")
async def add_photo(
    name: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...)
):
    return await add_photo_logic(name, category_id, file)

@router.get("/list")
def list_photos():
    return list_photos_logic()

@router.delete("/delete/{photo_id}")
def delete_photo(photo_id: int):
    return remove_photo_logic(photo_id)