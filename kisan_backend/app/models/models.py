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
