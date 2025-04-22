from fastapi import FastAPI
from models import MsgPayload

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
    msg_id = max(messages_list.keys(), default=0) + 1  # Use default=0 to handle empty dict
    new_message = MsgPayload(msg_id=msg_id, msg_name=msg_name)
    messages_list[msg_id] = new_message

    return {"message": new_message}


@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages": messages_list}