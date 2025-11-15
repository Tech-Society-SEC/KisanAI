 
from fastapi import FastAPI
from app.models.database import SessionLocal, engine
from app.models import models
from app.routes.user_routes import router as user_router
from app.routes.login_routes import router as login_router
from app.routes.diagnosis_routes import router as diagnosis_router
from app.routes.market_routes import router as market_router
from app.routes.scheme_routes import router as scheme_router
from app.routes.notification_routes import router as notification_router
from app.routes.help_routes import router as help_router
from app.routes.voice_agent_routes import router as voice_agent_router



app = FastAPI()
app.include_router(user_router)
app.include_router(login_router)
app.include_router(market_router)
app.include_router(diagnosis_router)
app.include_router(scheme_router)
app.include_router(voice_agent_router)
app.include_router(notification_router)
app.include_router(help_router)
@app.get("/")
def read_root():
    return {"message": "Kisan+ Backend API Running"}

from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import sys
def scheduled_market_price_update():
    print("APScheduler: Fetching latest market prices...")
    subprocess.run([sys.executable, "scripts/fetch_market_api.py"])


scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_market_price_update, 'interval', minutes=1)  # Daily
scheduler.start()

def scheduled_scheme_update():
    print("APScheduler: Fetching farmer schemes...")
    subprocess.run([sys.executable, "scripts/fetch_schemes.py"])

scheduler.add_job(scheduled_scheme_update, 'interval', minutes=1)
