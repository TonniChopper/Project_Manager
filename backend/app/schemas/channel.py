from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ChannelBase(BaseModel):
    name: str
    description: str | None = None
    is_private: bool = False


class ChannelCreate(ChannelBase):
    project_id: int


class ChannelUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_private: bool | None = None


class ChannelPublic(ChannelBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChannelDetail(ChannelPublic):
    pass

