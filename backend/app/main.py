from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import items, users, photo

app = FastAPI()
app.mount("/upload", StaticFiles(directory="upload"), name="upload")

app.include_router(items.router)
app.include_router(users.router)
app.include_router(photo.router)