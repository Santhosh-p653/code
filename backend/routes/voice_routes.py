from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import VoiceTranscription, VoiceTranscriptionCreate, VoiceToTemplateConversion, VoiceToTemplateConversionCreate
from ..services.voice_service import VoiceService, VoiceToTemplateService
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/voice", tags=["voice"])

# Voice transcription endpoints
@router.post("/transcriptions", response_model=VoiceTranscription, status_code=status.HTTP_201_CREATED)
async def create_voice_transcription(transcription_data: VoiceTranscriptionCreate):
    """Create a new voice transcription"""
    try:
        transcription = await VoiceService.create_voice_transcription(transcription_data)
        
        # Log activity
        await DashboardService.log_activity(
            transcription_data.staff_id,
            f"Created voice transcription ({transcription_data.duration}s)"
        )
        
        return transcription
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating voice transcription: {str(e)}"
        )

@router.get("/transcriptions/staff/{staff_id}", response_model=List[VoiceTranscription])
async def get_voice_transcriptions_by_staff(staff_id: str):
    """Get all voice transcriptions for a staff member"""
    try:
        transcriptions = await VoiceService.get_voice_transcriptions_by_staff(staff_id)
        return transcriptions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving voice transcriptions: {str(e)}"
        )

@router.get("/transcriptions/{transcription_id}", response_model=VoiceTranscription)
async def get_voice_transcription(transcription_id: str):
    """Get voice transcription by ID"""
    try:
        transcription = await VoiceService.get_voice_transcription(transcription_id)
        if not transcription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice transcription not found"
            )
        return transcription
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving voice transcription: {str(e)}"
        )

@router.delete("/transcriptions/{transcription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_voice_transcription(transcription_id: str):
    """Delete voice transcription"""
    try:
        success = await VoiceService.delete_voice_transcription(transcription_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice transcription not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting voice transcription: {str(e)}"
        )

# Voice to template conversion endpoints
@router.post("/process-template", response_model=dict)
async def process_voice_to_template(transcription: str, staff_id: str):
    """Process voice transcription and extract template data"""
    try:
        result = await VoiceToTemplateService.process_voice_to_template(transcription, staff_id)
        
        # Log activity
        await DashboardService.log_activity(
            staff_id,
            f"Processed voice to template with {result['confidence']*100:.0f}% confidence"
        )
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing voice to template: {str(e)}"
        )

@router.post("/template-conversions", response_model=VoiceToTemplateConversion, status_code=status.HTTP_201_CREATED)
async def create_voice_to_template_conversion(conversion_data: VoiceToTemplateConversionCreate):
    """Create a new voice to template conversion"""
    try:
        conversion = await VoiceToTemplateService.create_voice_to_template_conversion(conversion_data)
        
        # Log activity
        await DashboardService.log_activity(
            conversion_data.staff_id,
            f"Saved AI conversion for {conversion_data.template_name}"
        )
        
        return conversion
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating voice to template conversion: {str(e)}"
        )

@router.get("/template-conversions/staff/{staff_id}", response_model=List[VoiceToTemplateConversion])
async def get_voice_to_template_conversions_by_staff(staff_id: str):
    """Get all voice to template conversions for a staff member"""
    try:
        conversions = await VoiceToTemplateService.get_voice_to_template_conversions_by_staff(staff_id)
        return conversions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving voice to template conversions: {str(e)}"
        )

@router.get("/template-conversions/{conversion_id}", response_model=VoiceToTemplateConversion)
async def get_voice_to_template_conversion(conversion_id: str):
    """Get voice to template conversion by ID"""
    try:
        conversion = await VoiceToTemplateService.get_voice_to_template_conversion(conversion_id)
        if not conversion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice to template conversion not found"
            )
        return conversion
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving voice to template conversion: {str(e)}"
        )

@router.delete("/template-conversions/{conversion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_voice_to_template_conversion(conversion_id: str):
    """Delete voice to template conversion"""
    try:
        success = await VoiceToTemplateService.delete_voice_to_template_conversion(conversion_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice to template conversion not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting voice to template conversion: {str(e)}"
        )