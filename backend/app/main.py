from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.settings import get_settings
from .api import api_router

settings = get_settings()

app = FastAPI(title=settings.API_TITLE, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, 'CORS_ORIGINS') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to Project Manager API"}

