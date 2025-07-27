from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'staff_utility_app')]

# Collections
staff_profiles_collection = db.staff_profiles
schedules_collection = db.schedules
attendance_records_collection = db.attendance_records
templates_collection = db.templates
form_submissions_collection = db.form_submissions
voice_transcriptions_collection = db.voice_transcriptions
voice_to_template_conversions_collection = db.voice_to_template_conversions
tasks_collection = db.tasks
activities_collection = db.activities
announcements_collection = db.announcements

async def init_database():
    """Initialize database with default data"""
    
    # Initialize default templates if none exist
    template_count = await templates_collection.count_documents({})
    if template_count == 0:
        default_templates = [
            {
                "id": "template_1",
                "name": "Lesson Plan Template",
                "category": "Academic",
                "fields": [
                    {"name": "subject", "label": "Subject", "type": "text", "required": True},
                    {"name": "grade", "label": "Grade Level", "type": "select", "options": ["Grade 9", "Grade 10", "Grade 11", "Grade 12"], "required": True},
                    {"name": "topic", "label": "Lesson Topic", "type": "text", "required": True},
                    {"name": "objectives", "label": "Learning Objectives", "type": "textarea", "required": True},
                    {"name": "duration", "label": "Duration (minutes)", "type": "number", "required": True},
                    {"name": "materials", "label": "Required Materials", "type": "textarea", "required": False},
                    {"name": "activities", "label": "Learning Activities", "type": "textarea", "required": True},
                    {"name": "assessment", "label": "Assessment Method", "type": "textarea", "required": True}
                ]
            },
            {
                "id": "template_2",
                "name": "Student Progress Report",
                "category": "Assessment",
                "fields": [
                    {"name": "studentName", "label": "Student Name", "type": "text", "required": True},
                    {"name": "studentId", "label": "Student ID", "type": "text", "required": True},
                    {"name": "subject", "label": "Subject", "type": "text", "required": True},
                    {"name": "period", "label": "Reporting Period", "type": "select", "options": ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"], "required": True},
                    {"name": "grade", "label": "Current Grade", "type": "select", "options": ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"], "required": True},
                    {"name": "strengths", "label": "Student Strengths", "type": "textarea", "required": True},
                    {"name": "improvements", "label": "Areas for Improvement", "type": "textarea", "required": True},
                    {"name": "recommendations", "label": "Recommendations", "type": "textarea", "required": True}
                ]
            },
            {
                "id": "template_3",
                "name": "Meeting Minutes Template",
                "category": "Administrative",
                "fields": [
                    {"name": "meetingTitle", "label": "Meeting Title", "type": "text", "required": True},
                    {"name": "date", "label": "Date", "type": "date", "required": True},
                    {"name": "time", "label": "Time", "type": "time", "required": True},
                    {"name": "attendees", "label": "Attendees", "type": "textarea", "required": True},
                    {"name": "agenda", "label": "Agenda Items", "type": "textarea", "required": True},
                    {"name": "discussions", "label": "Key Discussions", "type": "textarea", "required": True},
                    {"name": "decisions", "label": "Decisions Made", "type": "textarea", "required": True},
                    {"name": "actionItems", "label": "Action Items", "type": "textarea", "required": True}
                ]
            }
        ]
        
        await templates_collection.insert_many(default_templates)
        print("✅ Default templates inserted")
    
    # Initialize default announcements if none exist
    announcement_count = await announcements_collection.count_documents({})
    if announcement_count == 0:
        default_announcements = [
            {
                "id": "announcement_1",
                "title": "Staff Meeting",
                "content": "Monthly staff meeting scheduled for Friday at 3:00 PM",
                "date": "2025-01-15"
            },
            {
                "id": "announcement_2",
                "title": "New Grading System",
                "content": "Please familiarize yourself with the updated grading guidelines",
                "date": "2025-01-14"
            }
        ]
        
        await announcements_collection.insert_many(default_announcements)
        print("✅ Default announcements inserted")

async def close_database():
    """Close database connection"""
    client.close()