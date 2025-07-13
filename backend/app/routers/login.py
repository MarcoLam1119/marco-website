from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.loginDTO import authenticate_user, create_access_token, validate_token
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)

# Token expiration time (30 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login endpoint that accepts username and password
    Returns access token if credentials are valid
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"],
        "role": user["role"]
    }

@router.get("/validate")
async def validate_token_endpoint(token: str = Depends(validate_token)):
    """
    Validate token endpoint
    Returns user info if token is valid
    """
    return {"valid": True, "user": token} 