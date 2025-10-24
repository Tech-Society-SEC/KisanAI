from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    state = Column(String)
    district = Column(String)
    village = Column(String)
    land_size = Column(Float)
    crops = Column(String)
    language = Column(String)
    
class CropDiagnosis(Base):
    __tablename__ = 'crop_diagnosis'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    crop = Column(String)
    photo = Column(String)  
    result = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship('User')