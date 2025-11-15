 
from pydantic import BaseModel

class HelpHistoryRequest(BaseModel):
    user_id: int
