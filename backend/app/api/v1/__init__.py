# New v1 router package initializer
from fastapi import APIRouter

from . import projects, tasks, channels, messages, users

v1_router = APIRouter()

v1_router.include_router(projects.router, prefix="/projects", tags=["projects"])
v1_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
v1_router.include_router(channels.router, prefix="/channels", tags=["channels"])
v1_router.include_router(messages.router, prefix="/messages", tags=["messages"])
v1_router.include_router(users.router, prefix="/users", tags=["users"])

