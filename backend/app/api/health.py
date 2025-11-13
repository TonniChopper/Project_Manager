from fastapi import APIRouter
from ..services.health_service import get_health_status
from ..schemas.health import HealthResponse

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def health() -> HealthResponse:
    return get_health_status()

