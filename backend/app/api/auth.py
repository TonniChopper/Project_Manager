from fastapi import APIRouter, Depends
from ..schemas.user import UserCreate, UserPublic, AuthRequest, AuthResponse, RefreshRequest
from ..services.auth_service import register, authenticate
from ..core.security import verify_token, create_access_token, get_current_user, _fake_users

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=201)
async def register_user(payload: UserCreate) -> UserPublic:
    return register(payload)

@router.post("/login", response_model=AuthResponse)
async def login(payload: AuthRequest) -> AuthResponse:
    return authenticate(payload)

@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(payload: RefreshRequest) -> AuthResponse:
    data = verify_token(payload.refresh_token, token_type="refresh")
    username = data.get("sub")
    new_access = create_access_token(username)
    user_store = _fake_users.get(username)
    public = UserPublic(username=username, email=None, role=user_store["role"]) if user_store else UserPublic(username=username, email=None, role="user")
    return AuthResponse(access_token=new_access, refresh_token=payload.refresh_token, user=public)  # client should store user separately

@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)) -> UserPublic:
    return UserPublic(username=user["username"], email=None, role=user["role"])
