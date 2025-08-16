from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import photo, git, login, calendar, blog, shareMS
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
app.include_router(git.router)
app.include_router(photo.routerPhoto)
app.include_router(photo.routerCategory)
app.include_router(calendar.router)
app.include_router(blog.router)
app.include_router(shareMS.router)
# app.include_router()
