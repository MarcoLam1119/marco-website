from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class CalendarEventModel(BaseModel):
    id: Optional[int] = None
    event_name: str
    event_description: str
    start_date: date
    end_date: date
    is_full_day: bool
    start_time: time
    end_time: time
    is_publish: bool
    is_delete: bool = False