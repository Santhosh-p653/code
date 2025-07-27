from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import DashboardData, Task, TaskCreate, Activity, ActivityCreate, Announcement, AnnouncementCreate
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/staff/{staff_id}", response_model=DashboardData)
async def get_dashboard_data(staff_id: str):
    """Get comprehensive dashboard data for a staff member"""
    try:
        dashboard_data = await DashboardService.get_dashboard_data(staff_id)
        return dashboard_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving dashboard data: {str(e)}"
        )

# Task endpoints
@router.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate):
    """Create a new task"""
    try:
        task = await DashboardService.create_task(task_data)
        return task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating task: {str(e)}"
        )

@router.get("/tasks/staff/{staff_id}", response_model=List[Task])
async def get_tasks_by_staff(staff_id: str):
    """Get all tasks for a staff member"""
    try:
        tasks = await DashboardService.get_tasks_by_staff(staff_id)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tasks: {str(e)}"
        )

@router.patch("/tasks/{task_id}/complete", response_model=Task)
async def complete_task(task_id: str):
    """Mark task as completed"""
    try:
        task = await DashboardService.complete_task(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Log activity
        await DashboardService.log_activity(
            task.staff_id,
            f"Completed task: {task.task}"
        )
        
        return task
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error completing task: {str(e)}"
        )

# Activity endpoints
@router.post("/activities", response_model=Activity, status_code=status.HTTP_201_CREATED)
async def create_activity(activity_data: ActivityCreate):
    """Create a new activity"""
    try:
        activity = await DashboardService.create_activity(activity_data)
        return activity
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating activity: {str(e)}"
        )

@router.get("/activities/staff/{staff_id}", response_model=List[Activity])
async def get_recent_activities_by_staff(staff_id: str, limit: int = 10):
    """Get recent activities for a staff member"""
    try:
        activities = await DashboardService.get_recent_activities_by_staff(staff_id, limit)
        return activities
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving activities: {str(e)}"
        )

# Announcement endpoints
@router.post("/announcements", response_model=Announcement, status_code=status.HTTP_201_CREATED)
async def create_announcement(announcement_data: AnnouncementCreate):
    """Create a new announcement"""
    try:
        announcement = await DashboardService.create_announcement(announcement_data)
        return announcement
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating announcement: {str(e)}"
        )

@router.get("/announcements", response_model=List[Announcement])
async def get_recent_announcements(limit: int = 10):
    """Get recent announcements"""
    try:
        announcements = await DashboardService.get_recent_announcements(limit)
        return announcements
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving announcements: {str(e)}"
        )