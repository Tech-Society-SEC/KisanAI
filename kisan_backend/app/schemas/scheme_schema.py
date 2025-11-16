 
from pydantic import BaseModel

class SchemeEligibilityRequest(BaseModel):
    user_id: int

class SchemeApplicationRequest(BaseModel):
    user_id: int
    scheme_id: int

