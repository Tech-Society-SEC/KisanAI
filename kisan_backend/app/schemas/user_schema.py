 
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    phone: str
    state: str
    district: str
    village: str
    land_size: float
    crops: str
    language: str
