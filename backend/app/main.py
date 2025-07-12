from fastapi import FastAPI
from .routers import items, users, photo

app = FastAPI()

app.include_router(items.router)
app.include_router(users.router)
app.include_router(photo.router)