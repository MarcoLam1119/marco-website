# model of event
from pydantic import BaseModel

class CalendarEventModel(BaseModel):
    id : int
	eventName : str
	eventDescription : str
	startDate : date
	EndDate : date
	isFullDate : bool
    starTime : time
    endTime : time
    isPublish : bool
    isDelete : bool
