 
from pydantic import BaseModel

class VoiceAgentRequest(BaseModel):
    user_id: int
    intent: str        # e.g., "diagnose", "market", "schemes"
    parameters: dict   # pass relevant command/details
