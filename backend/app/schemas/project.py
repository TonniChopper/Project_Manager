from pydantic import BaseModel, ConfigDict
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectBase(BaseModel):
    name: str
    description: str | None = None
    status: ProjectStatus = ProjectStatus.PLANNING
    start_date: datetime | None = None
    end_date: datetime | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: ProjectStatus | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_archived: bool | None = None


class ProjectPublic(ProjectBase):
    id: int
    owner_id: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectDetail(ProjectPublic):
    pass


# ---- Added metrics models ----
class ProjectMetrics(BaseModel):
    total_tasks: int
    completed_tasks: int
    progress_percent: float
    overdue_tasks: int
    velocity_7d: int  # число задач завершенных за последние 7 дней


class ProjectWithMetrics(ProjectPublic):
    metrics: ProjectMetrics
    model_config = ConfigDict(from_attributes=True)
