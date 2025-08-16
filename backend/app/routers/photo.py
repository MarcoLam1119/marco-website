from fastapi import APIRouter, UploadFile, Form, File

from app.services.photoDTO import add_photo_logic, list_photos_logic, remove_photo_logic, add_category_logic, list_category_logic

routerPhoto = APIRouter(
    prefix="/photos",
    tags=["Photos"],
)

@routerPhoto.post("/add")
async def add_photo(
    name: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...)
):
    return await add_photo_logic(name, category_id, file)

@routerPhoto.get("/list")
def list_photos():
    return list_photos_logic()

@routerPhoto.delete("/delete/{photo_id}")
def delete_photo(photo_id: int):
    return remove_photo_logic(photo_id)

# Photo Category
routerCategory = APIRouter(
    prefix="/category",
    tags=["Category"],
)

@routerCategory.post("/add")
async def add_category(
    category_name: str = Form(...)
):
    return add_category_logic(category_name)

@routerCategory.get("/list")
def list_category():
    return list_category_logic()