from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import StaffProfile, StaffProfileCreate, StaffProfileUpdate
from ..services.staff_service import StaffService

router = APIRouter(prefix="/staff", tags=["staff"])

@router.post("/", response_model=StaffProfile, status_code=status.HTTP_201_CREATED)
async def create_staff_profile(staff_data: StaffProfileCreate):
    """Create a new staff profile"""
    try:
        # Check if email already exists
        existing_staff = await StaffService.get_staff_by_email(staff_data.email)
        if existing_staff:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Staff member with this email already exists"
            )
        
        staff_profile = await StaffService.create_staff_profile(staff_data)
        return staff_profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating staff profile: {str(e)}"
        )

@router.get("/", response_model=List[StaffProfile])
async def get_all_staff_profiles():
    """Get all staff profiles"""
    try:
        profiles = await StaffService.get_all_staff_profiles()
        return profiles
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving staff profiles: {str(e)}"
        )

@router.get("/{staff_id}", response_model=StaffProfile)
async def get_staff_profile(staff_id: str):
    """Get staff profile by ID"""
    try:
        profile = await StaffService.get_staff_profile(staff_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff profile not found"
            )
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving staff profile: {str(e)}"
        )

@router.put("/{staff_id}", response_model=StaffProfile)
async def update_staff_profile(staff_id: str, update_data: StaffProfileUpdate):
    """Update staff profile"""
    try:
        # Check if staff exists
        existing_profile = await StaffService.get_staff_profile(staff_id)
        if not existing_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff profile not found"
            )
        
        # Check if email is being updated and already exists
        if update_data.email and update_data.email != existing_profile.email:
            existing_email = await StaffService.get_staff_by_email(update_data.email)
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Staff member with this email already exists"
                )
        
        updated_profile = await StaffService.update_staff_profile(staff_id, update_data)
        if not updated_profile:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update staff profile"
            )
        return updated_profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating staff profile: {str(e)}"
        )

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff_profile(staff_id: str):
    """Delete staff profile"""
    try:
        success = await StaffService.delete_staff_profile(staff_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff profile not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting staff profile: {str(e)}"
        )

@router.get("/email/{email}", response_model=StaffProfile)
async def get_staff_by_email(email: str):
    """Get staff profile by email"""
    try:
        profile = await StaffService.get_staff_by_email(email)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Staff profile not found"
            )
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving staff profile: {str(e)}"
        )