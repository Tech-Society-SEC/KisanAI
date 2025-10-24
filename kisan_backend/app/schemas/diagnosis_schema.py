 
from pydantic import BaseModel

class DiagnosisRequest(BaseModel):
    user_id: int
    crop: str
    # In a real app, you'd handle photo as file upload, but let's mock it
    description: str  # Farmer's spoken/text description (optional)
