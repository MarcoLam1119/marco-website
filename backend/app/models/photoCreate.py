from pydantic import BaseModel

class PhotoCreate(BaseModel):
    id: int
    name: str
    category_id: int
    location_path: str