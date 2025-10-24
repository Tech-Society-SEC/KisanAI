 
from pydantic import BaseModel

class LoginRequest(BaseModel):
    phone: str
    otp: str  # In real app, validate OTP; for now, mock it
