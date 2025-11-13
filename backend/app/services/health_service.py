from ..core.settings import get_settings
from ..schemas.health import HealthResponse

def get_health_status() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(status="ok", service=settings.API_TITLE)

