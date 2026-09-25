from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    district = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    scans = relationship("Scan", back_populates="owner")
    notifications = relationship("Notification", back_populates="user")
    reminders = relationship("Reminder", back_populates="user")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    body_location = Column(String) # e.g. "Right Arm"
    image_data = Column(Text) # LargeObject/Bytea reference or base64 (since no Supabase, we might use a surrogate path or base64 text for prototype)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="scans")
    result = relationship("AIResult", back_populates="scan", uselist=False)

class AIResult(Base):
    __tablename__ = "ai_results"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    prediction = Column(String)
    confidence = Column(Float)
    risk_score = Column(Float)
    risk_flag = Column(String) # LOW, MODERATE, HIGH
    reasons = Column(Text) # JSON string or plain text
    gradcam_data = Column(Text) # base64 image or ref
    
    scan = relationship("Scan", back_populates="result")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    clinic_name = Column(String)
    address = Column(String)
    district = Column(String, index=True)
    phone = Column(String)
    verification_status = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    title = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="notifications")

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True)
    type = Column(String)
    due_date = Column(DateTime)
    status = Column(String, default="PENDING")
    
    user = relationship("User", back_populates="reminders")
