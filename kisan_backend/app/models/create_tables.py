# create_tables.py (run from project root)
from app.models import models
from app.models.database import engine

if __name__ == "__main__":
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    print("Tables recreated")
