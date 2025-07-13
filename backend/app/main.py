from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import items, users, photo, git, login
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/upload", StaticFiles(directory="../frontend/upload"), name="upload")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router)
app.include_router(items.router)
app.include_router(users.router)
app.include_router(photo.router)
app.include_router(git.router)