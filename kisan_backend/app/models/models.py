from datetime import datetime
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    state: Mapped[str | None] = mapped_column(String)
    district: Mapped[str | None] = mapped_column(String)
    village: Mapped[str | None] = mapped_column(String)
    land_size: Mapped[float | None] = mapped_column(Float)
    crops: Mapped[str | None] = mapped_column(String)
    language: Mapped[str | None] = mapped_column(String)

    diagnoses: Mapped[list["CropDiagnosis"]] = relationship(back_populates="user")

class CropDiagnosis(Base):
    __tablename__ = "crop_diagnosis"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    crop: Mapped[str] = mapped_column(String)
    photo: Mapped[str | None] = mapped_column(String)
    result: Mapped[str | None] = mapped_column(String)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="diagnoses")
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime

Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=True)
    phone = Column(String, unique=True, nullable=True)
    state = Column(String)
    district = Column(String)
    village = Column(String)
    land_size = Column(Float)
    crops = Column(String)
    language = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CropDiagnosis(Base):
    __tablename__ = 'crop_diagnosis'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    crop = Column(String)
    photo = Column(String)
    result = Column(Text)
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


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    token_hash = Column(Text, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    user = relationship("User")
