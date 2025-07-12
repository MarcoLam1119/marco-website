from fastapi import APIRouter, UploadFile, File, Form
from app.services.photoDTO import add_photo_logic, list_photos_logic, remove_photo_logic

router = APIRouter(
    prefix="/photos",
    tags=["photos"],
)

@router.post("/upload")
async def upload_photo(
    name: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...)
):
    return await add_photo_logic(name, category_id, file)

@router.get("/")
def list_photos():
    return list_photos_logic()

@router.delete("/{photo_id}")
def delete_photo(photo_id: int):
    return remove_photo_logic(photo_id)