from fastapi import FastAPI
from .routers import items, users, photo  # <-- change 'photos' to 'photo'

app = FastAPI()

app.include_router(items.router)
app.include_router(users.router)
app.include_router(photo.router)  # <-- change 'photos' to 'photo'