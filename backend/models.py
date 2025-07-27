from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums for status fields
class ScheduleStatus(str, Enum):
    scheduled = "scheduled"
    substitution_needed = "substitution_needed"
    cancelled = "cancelled"
    completed = "completed"

class AttendanceStatus(str, Enum):
    present = "present"
    absent = "absent"
    late = "late"

class FormStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

# Staff Profile Models
class StaffProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    employee_id: str
    department: str
    subjects: List[str]
    email: str
    phone: str
    join_date: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StaffProfileCreate(BaseModel):
    name: str
    role: str
    employee_id: str
    department: str
    subjects: List[str]
    email: str
    phone: str
    join_date: str
    avatar: Optional[str] = None

class StaffProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[str] = None
    subjects: Optional[List[str]] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    join_date: Optional[str] = None
    avatar: Optional[str] = None

# Schedule Models
class Schedule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    time: str
    subject: str
    class_name: str = Field(alias="class")
    room: str
    day: str
    status: ScheduleStatus = ScheduleStatus.scheduled
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True

class ScheduleCreate(BaseModel):
    time: str
    subject: str
    class_name: str = Field(alias="class")
    room: str
    day: str
    status: ScheduleStatus = ScheduleStatus.scheduled
    staff_id: str

    class Config:
        allow_population_by_field_name = True

class ScheduleUpdate(BaseModel):
    time: Optional[str] = None
    subject: Optional[str] = None
    class_name: Optional[str] = Field(None, alias="class")
    room: Optional[str] = None
    day: Optional[str] = None
    status: Optional[ScheduleStatus] = None

    class Config:
        allow_population_by_field_name = True

# Student Models
class Student(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    status: AttendanceStatus = AttendanceStatus.present

class StudentCreate(BaseModel):
    name: str
    status: AttendanceStatus = AttendanceStatus.present

# Attendance Models
class AttendanceRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    class_name: str
    date: str
    total_students: int
    present: int
    absent: int
    late: int
    students: List[Student]
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AttendanceRecordCreate(BaseModel):
    class_name: str
    date: str
    students: List[StudentCreate]
    staff_id: str

class AttendanceRecordUpdate(BaseModel):
    class_name: Optional[str] = None
    date: Optional[str] = None
    students: Optional[List[Student]] = None

# Template Models
class TemplateField(BaseModel):
    name: str
    label: str
    type: str
    required: bool = False
    options: Optional[List[str]] = None

class Template(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    fields: List[TemplateField]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TemplateCreate(BaseModel):
    name: str
    category: str
    fields: List[TemplateField]

# Form Submission Models
class FormSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    template_name: str
    template_id: str
    data: Dict[str, Any]
    status: FormStatus = FormStatus.draft
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FormSubmissionCreate(BaseModel):
    template_name: str
    template_id: str
    data: Dict[str, Any]
    status: FormStatus = FormStatus.draft
    staff_id: str

class FormSubmissionUpdate(BaseModel):
    data: Optional[Dict[str, Any]] = None
    status: Optional[FormStatus] = None

# Voice Transcription Models
class VoiceTranscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    duration: int  # Duration in seconds
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VoiceTranscriptionCreate(BaseModel):
    text: str
    duration: int
    staff_id: str

# Voice to Template Conversion Models
class VoiceToTemplateConversion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    template_name: str
    original_transcription: str
    extracted_data: Dict[str, Any]
    status: FormStatus = FormStatus.draft
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VoiceToTemplateConversionCreate(BaseModel):
    template_name: str
    original_transcription: str
    extracted_data: Dict[str, Any]
    status: FormStatus = FormStatus.draft
    staff_id: str

# Dashboard Models
class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task: str
    priority: Priority
    due_date: str
    staff_id: str
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(BaseModel):
    task: str
    priority: Priority
    due_date: str
    staff_id: str

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    activity: str
    staff_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityCreate(BaseModel):
    activity: str
    staff_id: str

class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    date: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    date: str

class DashboardData(BaseModel):
    today_schedule: List[Schedule]
    upcoming_tasks: List[Task]
    recent_activities: List[Activity]
    announcements: List[Announcement]
    stats: Dict[str, int]