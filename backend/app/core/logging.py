import logging
from .settings import get_settings

_settings = get_settings()

logging.basicConfig(
    level=_settings.LOG_LEVEL.upper(),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("project_manager")

