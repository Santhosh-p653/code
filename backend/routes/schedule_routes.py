from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from ..models import Schedule, ScheduleCreate, ScheduleUpdate, ScheduleStatus
from ..services.schedule_service import ScheduleService
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.post("/", response_model=Schedule, status_code=status.HTTP_201_CREATED)
async def create_schedule(schedule_data: ScheduleCreate):
    """Create a new schedule entry"""
    try:
        schedule = await ScheduleService.create_schedule(schedule_data)
        
        # Log activity
        await DashboardService.log_activity(
            schedule_data.staff_id,
            f"Added new class: {schedule_data.subject} - {schedule_data.class_name}"
        )
        
        return schedule
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating schedule: {str(e)}"
        )

@router.get("/staff/{staff_id}", response_model=List[Schedule])
async def get_schedules_by_staff(staff_id: str):
    """Get all schedules for a staff member"""
    try:
        schedules = await ScheduleService.get_schedules_by_staff(staff_id)
        return schedules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving schedules: {str(e)}"
        )

@router.get("/staff/{staff_id}/day/{day}", response_model=List[Schedule])
async def get_schedules_by_day(staff_id: str, day: str):
    """Get schedules for a specific day"""
    try:
        schedules = await ScheduleService.get_schedules_by_day(staff_id, day)
        return schedules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving schedules for {day}: {str(e)}"
        )

@router.get("/{schedule_id}", response_model=Schedule)
async def get_schedule(schedule_id: str):
    """Get schedule by ID"""
    try:
        schedule = await ScheduleService.get_schedule(schedule_id)
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        return schedule
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving schedule: {str(e)}"
        )

@router.put("/{schedule_id}", response_model=Schedule)
async def update_schedule(schedule_id: str, update_data: ScheduleUpdate):
    """Update schedule entry"""
    try:
        # Check if schedule exists
        existing_schedule = await ScheduleService.get_schedule(schedule_id)
        if not existing_schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        updated_schedule = await ScheduleService.update_schedule(schedule_id, update_data)
        if not updated_schedule:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update schedule"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_schedule.staff_id,
            f"Updated schedule for {existing_schedule.subject}"
        )
        
        return updated_schedule
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating schedule: {str(e)}"
        )

@router.patch("/{schedule_id}/status", response_model=Schedule)
async def update_schedule_status(schedule_id: str, status: ScheduleStatus):
    """Update schedule status"""
    try:
        # Check if schedule exists
        existing_schedule = await ScheduleService.get_schedule(schedule_id)
        if not existing_schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        updated_schedule = await ScheduleService.update_schedule_status(schedule_id, status)
        if not updated_schedule:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update schedule status"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_schedule.staff_id,
            f"Changed status of {existing_schedule.subject} to {status.value}"
        )
        
        return updated_schedule
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating schedule status: {str(e)}"
        )

@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(schedule_id: str):
    """Delete schedule entry"""
    try:
        # Check if schedule exists
        existing_schedule = await ScheduleService.get_schedule(schedule_id)
        if not existing_schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        success = await ScheduleService.delete_schedule(schedule_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete schedule"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_schedule.staff_id,
            f"Deleted schedule for {existing_schedule.subject}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting schedule: {str(e)}"
        )

@router.get("/staff/{staff_id}/stats")
async def get_schedule_stats(staff_id: str):
    """Get schedule statistics for a staff member"""
    try:
        stats = await ScheduleService.get_schedule_stats(staff_id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving schedule stats: {str(e)}"
        )