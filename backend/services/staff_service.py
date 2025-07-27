from typing import List, Optional
from datetime import datetime
from ..database import staff_profiles_collection
from ..models import StaffProfile, StaffProfileCreate, StaffProfileUpdate

class StaffService:
    
    @staticmethod
    async def create_staff_profile(staff_data: StaffProfileCreate) -> StaffProfile:
        """Create a new staff profile"""
        staff_dict = staff_data.dict()
        staff_dict["id"] = staff_dict.get("id", str(datetime.now().timestamp()).replace(".", ""))
        staff_dict["created_at"] = datetime.utcnow()
        staff_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await staff_profiles_collection.insert_one(staff_dict)
        
        # Retrieve the created profile
        created_profile = await staff_profiles_collection.find_one({"_id": result.inserted_id})
        created_profile.pop("_id", None)
        
        return StaffProfile(**created_profile)
    
    @staticmethod
    async def get_staff_profile(staff_id: str) -> Optional[StaffProfile]:
        """Get staff profile by ID"""
        profile = await staff_profiles_collection.find_one({"id": staff_id})
        if profile:
            profile.pop("_id", None)
            return StaffProfile(**profile)
        return None
    
    @staticmethod
    async def get_all_staff_profiles() -> List[StaffProfile]:
        """Get all staff profiles"""
        profiles = []
        cursor = staff_profiles_collection.find({})
        async for profile in cursor:
            profile.pop("_id", None)
            profiles.append(StaffProfile(**profile))
        return profiles
    
    @staticmethod
    async def update_staff_profile(staff_id: str, update_data: StaffProfileUpdate) -> Optional[StaffProfile]:
        """Update staff profile"""
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        if not update_dict:
            return await StaffService.get_staff_profile(staff_id)
        
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await staff_profiles_collection.update_one(
            {"id": staff_id},
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await StaffService.get_staff_profile(staff_id)
        return None
    
    @staticmethod
    async def delete_staff_profile(staff_id: str) -> bool:
        """Delete staff profile"""
        result = await staff_profiles_collection.delete_one({"id": staff_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def get_staff_by_email(email: str) -> Optional[StaffProfile]:
        """Get staff profile by email"""
        profile = await staff_profiles_collection.find_one({"email": email})
        if profile:
            profile.pop("_id", None)
            return StaffProfile(**profile)
        return None