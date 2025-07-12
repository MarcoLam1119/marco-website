from fastapi import APIRouter

router = APIRouter()

@router.get("/admin")
def read_admin():
    return {"admin": True}