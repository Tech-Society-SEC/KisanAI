from pydantic import BaseModel
from typing import Optional

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    land_size: Optional[float] = None
    crops: Optional[str] = None
    language: Optional[str] = None
