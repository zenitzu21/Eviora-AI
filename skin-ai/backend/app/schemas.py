from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    district: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ScanCreate(BaseModel):
    body_location: str
    image_data: str

class AIResultSchema(BaseModel):
    prediction: str
    confidence: float
    risk_score: float
    risk_flag: str
    reasons: str
    gradcam_data: Optional[str] = None
    class Config:
        orm_mode = True

class ScanResponse(BaseModel):
    id: int
    user_id: int
    body_location: str
    created_at: datetime
    result: Optional[AIResultSchema] = None
    class Config:
        orm_mode = True

class DoctorSchema(BaseModel):
    id: int
    name: str
    specialization: str
    clinic_name: str
    address: str
    phone: str
    verification_status: bool
    class Config:
        orm_mode = True

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    created_at: datetime
    read: bool
    class Config:
        orm_mode = True

class ReminderResponse(BaseModel):
    id: int
    type: str
    due_date: datetime
    status: str
    class Config:
        orm_mode = True
