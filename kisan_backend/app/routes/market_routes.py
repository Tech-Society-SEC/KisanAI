 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import MarketPrice
from app.schemas.market_schema import MarketPriceRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/market")
def get_market_price(req: MarketPriceRequest, db: Session = Depends(get_db)):
    query = db.query(MarketPrice).filter(MarketPrice.crop.ilike(req.crop))
    if req.mandi:
        query = query.filter(MarketPrice.mandi.ilike(req.mandi))
    prices = query.all()
    result = [
        {"mandi": p.mandi, "price": p.price, "trend": p.trend}
        for p in prices
    ]
    return {"prices": result}
