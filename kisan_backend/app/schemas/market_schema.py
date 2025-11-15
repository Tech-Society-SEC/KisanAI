 
from pydantic import BaseModel

class MarketPriceRequest(BaseModel):
    crop: str
    mandi: str = None  # optional: if specific mandi (market) is needed
