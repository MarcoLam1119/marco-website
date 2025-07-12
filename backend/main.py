from fastapi import FastAPI, HTTPException, UploadFile, File
from typing import List
from models import MsgPayload
import photoDTO

app = FastAPI()
messages_list: dict[int, MsgPayload] = {}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello"}


@app.get("/about")
def about() -> dict[str, str]:
    return {"message": "This is the about page."}


@app.post("/messages/{msg_name}/")
def add_msg(msg_name: str) -> dict[str, MsgPayload]:
    msg_id = max(messages_list.keys(), default=0) + 1
    new_message = MsgPayload(msg_id=msg_id, msg_name=msg_name)
    messages_list[msg_id] = new_message
    return {"message": new_message}


@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages": messages_list}


@app.post("/photo/add")
async def add_photo(
    name: str,
    category_id: int,
    file: UploadFile = File(...),
):
    file_location = await photo_service.add_photo_logic(name, category_id, file)
    if file_location:
        return {"message": "Photo added successfully", "location_path": file_location}
    raise HTTPException(status_code=400, detail="Failed to add photo")


@app.get("/photo/list")
def list_photo():
    photos = photo_service.list_photos_logic()
    return photos


@app.post("/photo/remove/{id}")
def remove_photo(id: int):
    result = photo_service.remove_photo_logic(id)
    if result:
        return {"message": "Photo removed successfully"}
    raise HTTPException(status_code=404, detail="Photo not found")