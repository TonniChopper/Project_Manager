from pydantic import BaseModel
from typing import Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str  # healthy, degraded, unhealthy
    service: str
    timestamp: Optional[str] = None
    environment: Optional[str] = None
    checks: Optional[Dict[str, Any]] = None

