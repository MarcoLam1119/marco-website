import aiofiles
from app.services import photoDAO
import os
from fastapi import UploadFile
from app.models.photoCreate import PhotoCreate
from fastapi import HTTPException

async def add_photo_logic(name: str, category_id: int, file: UploadFile) -> dict:
    upload_folder = "upload"
    os.makedirs(upload_folder, exist_ok=True)
    
    # Sanitize the filename
    safe_filename = os.path.basename(file.filename)
    file_location = os.path.join(upload_folder, safe_filename)

    try:
        async with aiofiles.open(file_location, "wb") as buffer:
            await buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    photo = PhotoCreate(name=name, category_id=category_id, location_path=file_location)
    photo_id = photoDAO.add_photo(photo.name, photo.category_id, photo.location_path)
    
    return {"file_location": file_location, "photo_id": photo_id}

def list_photos_logic() -> list:
    try:
        photos = photoDAO.list_photos()
        photo_list = []

        for photo in photos:
            # Unpack the values based on the expected structure
            photo_data = PhotoCreate(
                id=photo[0],  # Assuming ID is the first element
                name=photo[1],  # Name is the second element
                category_id=photo[2],  # Category ID is the third element
                location_path=photo[3]  # Upload location is the fourth element
                # Add other fields as necessary
            )
            photo_list.append({
                "id": photo_data.id,
                "name": photo_data.name,
                "category_id": photo_data.category_id,
                "upload_location": photo_data.location_path
            })

        return photo_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list photos: {str(e)}")

def remove_photo_logic(photo_id: int) -> dict:
    try:
        result = photoDAO.remove_photo(photo_id)
        if result:
            return {"message": "Photo removed successfully."}
        else:
            raise HTTPException(status_code=404, detail="Photo not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove photo: {str(e)}")