from typing import List, Optional
from datetime import datetime
from ..database import schedules_collection
from ..models import Schedule, ScheduleCreate, ScheduleUpdate, ScheduleStatus

class ScheduleService:
    
    @staticmethod
    async def create_schedule(schedule_data: ScheduleCreate) -> Schedule:
        """Create a new schedule entry"""
        schedule_dict = schedule_data.dict(by_alias=True)
        schedule_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        schedule_dict["created_at"] = datetime.utcnow()
        schedule_dict["updated_at"] = datetime.utcnow()
        
        result = await schedules_collection.insert_one(schedule_dict)
        
        created_schedule = await schedules_collection.find_one({"_id": result.inserted_id})
        created_schedule.pop("_id", None)
        
        return Schedule(**created_schedule)
    
    @staticmethod
    async def get_schedule(schedule_id: str) -> Optional[Schedule]:
        """Get schedule by ID"""
        schedule = await schedules_collection.find_one({"id": schedule_id})
        if schedule:
            schedule.pop("_id", None)
            return Schedule(**schedule)
        return None
    
    @staticmethod
    async def get_schedules_by_staff(staff_id: str) -> List[Schedule]:
        """Get all schedules for a staff member"""
        schedules = []
        cursor = schedules_collection.find({"staff_id": staff_id})
        async for schedule in cursor:
            schedule.pop("_id", None)
            schedules.append(Schedule(**schedule))
        return schedules
    
    @staticmethod
    async def get_schedules_by_day(staff_id: str, day: str) -> List[Schedule]:
        """Get schedules for a specific day"""
        schedules = []
        cursor = schedules_collection.find({"staff_id": staff_id, "day": day})
        async for schedule in cursor:
            schedule.pop("_id", None)
            schedules.append(Schedule(**schedule))
        return sorted(schedules, key=lambda x: x.time)
    
    @staticmethod
    async def update_schedule(schedule_id: str, update_data: ScheduleUpdate) -> Optional[Schedule]:
        """Update schedule entry"""
        update_dict = {k: v for k, v in update_data.dict(by_alias=True).items() if v is not None}
        if not update_dict:
            return await ScheduleService.get_schedule(schedule_id)
        
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await schedules_collection.update_one(
            {"id": schedule_id},
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await ScheduleService.get_schedule(schedule_id)
        return None
    
    @staticmethod
    async def update_schedule_status(schedule_id: str, status: ScheduleStatus) -> Optional[Schedule]:
        """Update schedule status"""
        result = await schedules_collection.update_one(
            {"id": schedule_id},
            {"$set": {"status": status.value, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count:
            return await ScheduleService.get_schedule(schedule_id)
        return None
    
    @staticmethod
    async def delete_schedule(schedule_id: str) -> bool:
        """Delete schedule entry"""
        result = await schedules_collection.delete_one({"id": schedule_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def get_schedule_stats(staff_id: str) -> dict:
        """Get schedule statistics"""
        total_schedules = await schedules_collection.count_documents({"staff_id": staff_id})
        scheduled = await schedules_collection.count_documents({"staff_id": staff_id, "status": "scheduled"})
        substitution_needed = await schedules_collection.count_documents({"staff_id": staff_id, "status": "substitution_needed"})
        cancelled = await schedules_collection.count_documents({"staff_id": staff_id, "status": "cancelled"})
        completed = await schedules_collection.count_documents({"staff_id": staff_id, "status": "completed"})
        
        return {
            "total": total_schedules,
            "scheduled": scheduled,
            "substitution_needed": substitution_needed,
            "cancelled": cancelled,
            "completed": completed
        }