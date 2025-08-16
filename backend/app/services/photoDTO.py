import aiofiles
import os
from fastapi import UploadFile
from app.models.photoCreate import PhotoCreate
from fastapi import HTTPException
from app.services.sqlDAO import execute_query

async def add_photo_logic(name: str, category_id: int, file: UploadFile) -> dict:
    upload_folder = "../frontend/upload"
    os.makedirs(upload_folder, exist_ok=True)
    
    # Sanitize the filename
    safe_filename = os.path.basename(file.filename)
    file_location = os.path.join(upload_folder, safe_filename)

    try:
        async with aiofiles.open(file_location, "wb") as buffer:
            await buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    photo = PhotoCreate(name=name, category_id=category_id, location_path=file_location.replace("../frontend/upload","upload"))
    query = (
        "INSERT INTO photo_location (name, category_id, location_path, upload_date, is_delete) "
        "VALUES (%s, %s, %s, NOW(), %s)"
    )
    photo_id = execute_query(query, (photo.name, photo.category_id, photo.location_path, 0))
    
    return {"file_location": file_location.replace("../frontend/upload","upload"), "photo_id": photo_id}

def list_photos_logic() -> list:
    try:
        query = "SELECT * FROM photo_location WHERE is_delete = 0"
        photos = execute_query(query, fetch=True)
        photo_list = []
        for photo in photos:
            photo_data = PhotoCreate(
                id=photo[0],  
                name=photo[1],
                category_id=photo[2],
                location_path=photo[3]
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
        query = "UPDATE photo_location SET is_delete = 1 WHERE id = %s"
        result = execute_query(query, (photo_id,))
        if result > 0:
            return {"message": "Photo removed successfully."}
        else:
            raise HTTPException(status_code=404, detail="Photo not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove photo: {str(e)}")

def add_category_logic(category_name: str) -> dict:
    try:
        query = "INSERT INTO photo_category (category_name) VALUES (%s)"
        category_id = execute_query(query, (category_name,))
        return {"category_id": category_id, "category_name": category_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to Add the new category: {str(e)}")

def list_category_logic() -> list:
    try:
        query = "SELECT * FROM photo_category"
        categorys = execute_query(query, fetch=True)
        category_list = []
        for category in categorys:
            category_list.append({
                "id": category[0],
                "category_name": category[1],
            })
        return category_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list category: {str(e)}")