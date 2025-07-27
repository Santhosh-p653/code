from typing import List, Optional
from datetime import datetime
from ..database import attendance_records_collection
from ..models import AttendanceRecord, AttendanceRecordCreate, AttendanceRecordUpdate, Student, AttendanceStatus

class AttendanceService:
    
    @staticmethod
    def _calculate_totals(students: List[Student]) -> dict:
        """Calculate attendance totals"""
        present = sum(1 for s in students if s.status == AttendanceStatus.present)
        absent = sum(1 for s in students if s.status == AttendanceStatus.absent)
        late = sum(1 for s in students if s.status == AttendanceStatus.late)
        total = len(students)
        
        return {
            "total_students": total,
            "present": present,
            "absent": absent,
            "late": late
        }
    
    @staticmethod
    async def create_attendance_record(attendance_data: AttendanceRecordCreate) -> AttendanceRecord:
        """Create a new attendance record"""
        students = [Student(**student.dict()) for student in attendance_data.students]
        totals = AttendanceService._calculate_totals(students)
        
        record_dict = attendance_data.dict()
        record_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        record_dict["students"] = [student.dict() for student in students]
        record_dict.update(totals)
        record_dict["created_at"] = datetime.utcnow()
        record_dict["updated_at"] = datetime.utcnow()
        
        result = await attendance_records_collection.insert_one(record_dict)
        
        created_record = await attendance_records_collection.find_one({"_id": result.inserted_id})
        created_record.pop("_id", None)
        
        return AttendanceRecord(**created_record)
    
    @staticmethod
    async def get_attendance_record(record_id: str) -> Optional[AttendanceRecord]:
        """Get attendance record by ID"""
        record = await attendance_records_collection.find_one({"id": record_id})
        if record:
            record.pop("_id", None)
            return AttendanceRecord(**record)
        return None
    
    @staticmethod
    async def get_attendance_records_by_staff(staff_id: str) -> List[AttendanceRecord]:
        """Get all attendance records for a staff member"""
        records = []
        cursor = attendance_records_collection.find({"staff_id": staff_id}).sort("date", -1)
        async for record in cursor:
            record.pop("_id", None)
            records.append(AttendanceRecord(**record))
        return records
    
    @staticmethod
    async def get_attendance_records_by_date(staff_id: str, date: str) -> List[AttendanceRecord]:
        """Get attendance records for a specific date"""
        records = []
        cursor = attendance_records_collection.find({"staff_id": staff_id, "date": date})
        async for record in cursor:
            record.pop("_id", None)
            records.append(AttendanceRecord(**record))
        return records
    
    @staticmethod
    async def update_attendance_record(record_id: str, update_data: AttendanceRecordUpdate) -> Optional[AttendanceRecord]:
        """Update attendance record"""
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        if not update_dict:
            return await AttendanceService.get_attendance_record(record_id)
        
        # Recalculate totals if students were updated
        if "students" in update_dict:
            students = [Student(**student) if isinstance(student, dict) else student for student in update_dict["students"]]
            totals = AttendanceService._calculate_totals(students)
            update_dict.update(totals)
            update_dict["students"] = [student.dict() if hasattr(student, 'dict') else student for student in students]
        
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await attendance_records_collection.update_one(
            {"id": record_id},
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await AttendanceService.get_attendance_record(record_id)
        return None
    
    @staticmethod
    async def update_student_attendance(record_id: str, student_id: str, status: AttendanceStatus) -> Optional[AttendanceRecord]:
        """Update specific student's attendance status"""
        record = await AttendanceService.get_attendance_record(record_id)
        if not record:
            return None
        
        # Update student status
        for student in record.students:
            if student.id == student_id:
                student.status = status
                break
        
        # Recalculate totals
        totals = AttendanceService._calculate_totals(record.students)
        
        result = await attendance_records_collection.update_one(
            {"id": record_id},
            {"$set": {
                "students": [student.dict() for student in record.students],
                **totals,
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count:
            return await AttendanceService.get_attendance_record(record_id)
        return None
    
    @staticmethod
    async def delete_attendance_record(record_id: str) -> bool:
        """Delete attendance record"""
        result = await attendance_records_collection.delete_one({"id": record_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def get_attendance_stats(staff_id: str) -> dict:
        """Get attendance statistics"""
        records = await AttendanceService.get_attendance_records_by_staff(staff_id)
        
        total_records = len(records)
        total_students = sum(record.total_students for record in records)
        total_present = sum(record.present for record in records)
        total_absent = sum(record.absent for record in records)
        total_late = sum(record.late for record in records)
        
        attendance_rate = (total_present / total_students * 100) if total_students > 0 else 0
        
        return {
            "total_records": total_records,
            "total_students_tracked": total_students,
            "total_present": total_present,
            "total_absent": total_absent,
            "total_late": total_late,
            "attendance_rate": round(attendance_rate, 2)
        }