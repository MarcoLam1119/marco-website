from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.services.loginDTO import authenticate_user, create_access_token, try_get_user_info
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)

# Token expiration time (120 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

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
async def validate_token_endpoint(token: str = Depends(oauth2_scheme)):
    """
    Validate token endpoint
    Returns user info if token is valid
    """
    user_info = try_get_user_info(token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"valid": True, "user": user_info}