 
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
    photo = Column(String)  # path to uploaded image
    result = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship('User')

class MarketPrice(Base):
    __tablename__ = 'market_prices'
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String)
    mandi = Column(String)
    price = Column(Float)
    trend = Column(String)

class Scheme(Base):
    __tablename__ = 'schemes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    eligibility_criteria = Column(Text)
    docs_needed = Column(Text)
    benefits = Column(String)
    deadline = Column(DateTime)

class SchemeApplication(Base):
    __tablename__ = 'scheme_applications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    scheme_id = Column(Integer, ForeignKey('schemes.id'))
    status = Column(String)
    user = relationship('User')
    scheme = relationship('Scheme')

class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    type = Column(String)
    content = Column(Text)
    read_flag = Column(Boolean, default=False)
    user = relationship('User')

class HelpHistory(Base):
    __tablename__ = 'help_history'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    query = Column(Text)
    result = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship('User')
