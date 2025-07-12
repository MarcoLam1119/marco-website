import aiofiles
from app.services import photoDAO
import os
from fastapi import UploadFile

class PhotoCreate:
    def __init__(self, name: str, category_id: int, location_path: str):
        self.name = name
        self.category_id = category_id
        self.location_path = location_path

async def add_photo_logic(name: str, category_id: int, file: UploadFile):
    upload_folder = "upload"
    os.makedirs(upload_folder, exist_ok=True)
    file_location = os.path.join(upload_folder, file.filename)

    try:
        async with aiofiles.open(file_location, "wb") as buffer:
            await buffer.write(await file.read())
    except Exception as e:
        # Handle file errors (e.g., log it, return an error response)
        return {"error": str(e)}

    photo = PhotoCreate(name=name, category_id=category_id, location_path=file_location)
    photo_id = photoDAO.add_photo(photo.name, photo.category_id, photo.location_path)
    return {"file_location": file_location, "photo_id": photo_id}

def list_photos_logic():
    return photoDAO.list_photos()

def remove_photo_logic(photo_id: int):
    return photoDAO.remove_photo(photo_id)