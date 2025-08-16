from fastapi import APIRouter, Form, Depends, HTTPException, Request
from typing import Optional
from datetime import date, time
from app.services.loginDTO import validate_admin_token, get_optional_token, try_get_user_info
from app.services.blogDTO import (
    add_blog_logic,
    get_blog_logic,
    list_blog_logic,
    update_blog_logic,
    delete_blog_logic,
)

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.post("/add")
async def add_blog(
    blog_content: str = Form(...),
):
    return await add_blog_logic(blog_content)

@router.get("/list")
def list_blog():
    return list_blog_logic()

@router.post("/update/{blog_id}")
async def update_blog(
    blog_id: int,
    blog_content: str = Form(...),
):
    return await update_blog_logic(blog_id, blog_content)

@router.delete("/delete/{blog_id}")
async def delete_blog(blog_id: int):
    return await delete_blog_logic(blog_id)