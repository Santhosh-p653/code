from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from ..models import AttendanceRecord, AttendanceRecordCreate, AttendanceRecordUpdate, AttendanceStatus
from ..services.attendance_service import AttendanceService
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("/", response_model=AttendanceRecord, status_code=status.HTTP_201_CREATED)
async def create_attendance_record(attendance_data: AttendanceRecordCreate):
    """Create a new attendance record"""
    try:
        record = await AttendanceService.create_attendance_record(attendance_data)
        
        # Log activity
        await DashboardService.log_activity(
            attendance_data.staff_id,
            f"Created attendance record for {attendance_data.class_name}"
        )
        
        return record
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating attendance record: {str(e)}"
        )

@router.get("/staff/{staff_id}", response_model=List[AttendanceRecord])
async def get_attendance_records_by_staff(staff_id: str):
    """Get all attendance records for a staff member"""
    try:
        records = await AttendanceService.get_attendance_records_by_staff(staff_id)
        return records
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving attendance records: {str(e)}"
        )

@router.get("/staff/{staff_id}/date/{date}", response_model=List[AttendanceRecord])
async def get_attendance_records_by_date(staff_id: str, date: str):
    """Get attendance records for a specific date"""
    try:
        records = await AttendanceService.get_attendance_records_by_date(staff_id, date)
        return records
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving attendance records for {date}: {str(e)}"
        )

@router.get("/{record_id}", response_model=AttendanceRecord)
async def get_attendance_record(record_id: str):
    """Get attendance record by ID"""
    try:
        record = await AttendanceService.get_attendance_record(record_id)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attendance record not found"
            )
        return record
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving attendance record: {str(e)}"
        )

@router.put("/{record_id}", response_model=AttendanceRecord)
async def update_attendance_record(record_id: str, update_data: AttendanceRecordUpdate):
    """Update attendance record"""
    try:
        # Check if record exists
        existing_record = await AttendanceService.get_attendance_record(record_id)
        if not existing_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attendance record not found"
            )
        
        updated_record = await AttendanceService.update_attendance_record(record_id, update_data)
        if not updated_record:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update attendance record"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_record.staff_id,
            f"Updated attendance for {existing_record.class_name}"
        )
        
        return updated_record
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating attendance record: {str(e)}"
        )

@router.patch("/{record_id}/student/{student_id}/status", response_model=AttendanceRecord)
async def update_student_attendance(record_id: str, student_id: str, status: AttendanceStatus):
    """Update specific student's attendance status"""
    try:
        # Check if record exists
        existing_record = await AttendanceService.get_attendance_record(record_id)
        if not existing_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attendance record not found"
            )
        
        # Check if student exists in the record
        student_exists = any(student.id == student_id for student in existing_record.students)
        if not student_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found in attendance record"
            )
        
        updated_record = await AttendanceService.update_student_attendance(record_id, student_id, status)
        if not updated_record:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update student attendance"
            )
        
        # Find student name for logging
        student_name = next((s.name for s in existing_record.students if s.id == student_id), "Student")
        
        # Log activity
        await DashboardService.log_activity(
            existing_record.staff_id,
            f"Marked {student_name} as {status.value} in {existing_record.class_name}"
        )
        
        return updated_record
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating student attendance: {str(e)}"
        )

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance_record(record_id: str):
    """Delete attendance record"""
    try:
        # Check if record exists
        existing_record = await AttendanceService.get_attendance_record(record_id)
        if not existing_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attendance record not found"
            )
        
        success = await AttendanceService.delete_attendance_record(record_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete attendance record"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_record.staff_id,
            f"Deleted attendance record for {existing_record.class_name}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting attendance record: {str(e)}"
        )

@router.get("/staff/{staff_id}/stats")
async def get_attendance_stats(staff_id: str):
    """Get attendance statistics for a staff member"""
    try:
        stats = await AttendanceService.get_attendance_stats(staff_id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving attendance stats: {str(e)}"
        )