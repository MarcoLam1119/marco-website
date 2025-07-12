from pydantic import BaseModel

class PhotoCreate(BaseModel):
    name: str
    category_id: int
    location_path: str