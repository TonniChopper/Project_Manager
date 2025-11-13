from pydantic import BaseModel, ConfigDict
from datetime import datetime


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    channel_id: int
    parent_id: int | None = None


class MessageUpdate(BaseModel):
    content: str


class MessagePublic(MessageBase):
    id: int
    channel_id: int
    author_id: int
    parent_id: int | None
    is_edited: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageDetail(MessagePublic):
    pass

