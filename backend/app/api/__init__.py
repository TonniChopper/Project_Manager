from fastapi import APIRouter
from . import health, auth, ws
from .v1 import v1_router

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(ws.router, prefix="/ws", tags=["ws"])

# include versioned APIs directly (main.py already mounts api_router under /api/v1)
api_router.include_router(v1_router)
