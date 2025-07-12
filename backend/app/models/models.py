from pydantic import BaseModel

class MsgPayload(BaseModel):
    msg_id: int
    msg_name: str