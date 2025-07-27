from typing import List, Optional
from datetime import datetime, date
from ..database import tasks_collection, activities_collection, announcements_collection
from ..models import Task, TaskCreate, Activity, ActivityCreate, Announcement, AnnouncementCreate, DashboardData
from .schedule_service import ScheduleService
from .attendance_service import AttendanceService

class DashboardService:
    
    @staticmethod
    async def create_task(task_data: TaskCreate) -> Task:
        """Create a new task"""
        task_dict = task_data.dict()
        task_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        task_dict["created_at"] = datetime.utcnow()
        
        result = await tasks_collection.insert_one(task_dict)
        
        created_task = await tasks_collection.find_one({"_id": result.inserted_id})
        created_task.pop("_id", None)
        
        return Task(**created_task)
    
    @staticmethod
    async def get_tasks_by_staff(staff_id: str) -> List[Task]:
        """Get all tasks for a staff member"""
        tasks = []
        cursor = tasks_collection.find({"staff_id": staff_id}).sort("due_date", 1)
        async for task in cursor:
            task.pop("_id", None)
            tasks.append(Task(**task))
        return tasks
    
    @staticmethod
    async def get_upcoming_tasks(staff_id: str, limit: int = 10) -> List[Task]:
        """Get upcoming tasks for a staff member"""
        tasks = []
        today = date.today().isoformat()
        cursor = tasks_collection.find({
            "staff_id": staff_id, 
            "completed": False,
            "due_date": {"$gte": today}
        }).sort("due_date", 1).limit(limit)
        
        async for task in cursor:
            task.pop("_id", None)
            tasks.append(Task(**task))
        return tasks
    
    @staticmethod
    async def complete_task(task_id: str) -> Optional[Task]:
        """Mark task as completed"""
        result = await tasks_collection.update_one(
            {"id": task_id},
            {"$set": {"completed": True}}
        )
        
        if result.modified_count:
            task = await tasks_collection.find_one({"id": task_id})
            task.pop("_id", None)
            return Task(**task)
        return None
    
    @staticmethod
    async def create_activity(activity_data: ActivityCreate) -> Activity:
        """Create a new activity"""
        activity_dict = activity_data.dict()
        activity_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        activity_dict["created_at"] = datetime.utcnow()
        
        result = await activities_collection.insert_one(activity_dict)
        
        created_activity = await activities_collection.find_one({"_id": result.inserted_id})
        created_activity.pop("_id", None)
        
        return Activity(**created_activity)
    
    @staticmethod
    async def get_recent_activities_by_staff(staff_id: str, limit: int = 10) -> List[Activity]:
        """Get recent activities for a staff member"""
        activities = []
        cursor = activities_collection.find({"staff_id": staff_id}).sort("created_at", -1).limit(limit)
        async for activity in cursor:
            activity.pop("_id", None)
            activities.append(Activity(**activity))
        return activities
    
    @staticmethod
    async def create_announcement(announcement_data: AnnouncementCreate) -> Announcement:
        """Create a new announcement"""
        announcement_dict = announcement_data.dict()
        announcement_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        announcement_dict["created_at"] = datetime.utcnow()
        
        result = await announcements_collection.insert_one(announcement_dict)
        
        created_announcement = await announcements_collection.find_one({"_id": result.inserted_id})
        created_announcement.pop("_id", None)
        
        return Announcement(**created_announcement)
    
    @staticmethod
    async def get_recent_announcements(limit: int = 10) -> List[Announcement]:
        """Get recent announcements"""
        announcements = []
        cursor = announcements_collection.find({}).sort("created_at", -1).limit(limit)
        async for announcement in cursor:
            announcement.pop("_id", None)
            announcements.append(Announcement(**announcement))
        return announcements
    
    @staticmethod
    async def get_dashboard_data(staff_id: str) -> DashboardData:
        """Get comprehensive dashboard data for a staff member"""
        
        # Get today's schedule
        today = datetime.now().strftime('%A')  # Monday, Tuesday, etc.
        today_schedule = await ScheduleService.get_schedules_by_day(staff_id, today)
        
        # Get upcoming tasks
        upcoming_tasks = await DashboardService.get_upcoming_tasks(staff_id, 4)
        
        # Get recent activities
        recent_activities = await DashboardService.get_recent_activities_by_staff(staff_id, 3)
        
        # Get announcements
        announcements = await DashboardService.get_recent_announcements(2)
        
        # Get statistics
        schedule_stats = await ScheduleService.get_schedule_stats(staff_id)
        attendance_stats = await AttendanceService.get_attendance_stats(staff_id)
        
        # Calculate completed tasks count
        completed_tasks_count = await tasks_collection.count_documents({
            "staff_id": staff_id,
            "completed": True
        })
        
        stats = {
            "today_classes": len(today_schedule),
            "completed_tasks": completed_tasks_count,
            "total_students": attendance_stats.get("total_students_tracked", 156),  # Default fallback
            "pending_tasks": len(upcoming_tasks)
        }
        
        return DashboardData(
            today_schedule=today_schedule,
            upcoming_tasks=upcoming_tasks,
            recent_activities=recent_activities,
            announcements=announcements,
            stats=stats
        )
    
    @staticmethod
    async def log_activity(staff_id: str, activity_description: str):
        """Log an activity for a staff member"""
        activity_data = ActivityCreate(
            activity=activity_description,
            staff_id=staff_id
        )
        await DashboardService.create_activity(activity_data)