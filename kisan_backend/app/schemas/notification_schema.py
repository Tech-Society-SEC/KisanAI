 
from pydantic import BaseModel

class NotificationRequest(BaseModel):
    user_id: int

class MarkReadRequest(BaseModel):
    user_id: int
    notification_id: int
