from pydantic import BaseModel
from typing import Optional

class PhotoCreate(BaseModel):
    id: Optional[int] = None
    name: str
    category_id: int
    location_path: str