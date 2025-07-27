from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from ..models import Template, TemplateCreate, FormSubmission, FormSubmissionCreate, FormSubmissionUpdate
from ..services.template_service import TemplateService, FormSubmissionService
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/templates", tags=["templates"])

# Template endpoints
@router.post("/", response_model=Template, status_code=status.HTTP_201_CREATED)
async def create_template(template_data: TemplateCreate):
    """Create a new template"""
    try:
        template = await TemplateService.create_template(template_data)
        return template
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating template: {str(e)}"
        )

@router.get("/", response_model=List[Template])
async def get_all_templates(category: Optional[str] = Query(None)):
    """Get all templates, optionally filtered by category"""
    try:
        if category:
            templates = await TemplateService.get_templates_by_category(category)
        else:
            templates = await TemplateService.get_all_templates()
        return templates
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving templates: {str(e)}"
        )

@router.get("/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get template by ID"""
    try:
        template = await TemplateService.get_template(template_id)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        return template
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving template: {str(e)}"
        )

@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: str):
    """Delete template"""
    try:
        success = await TemplateService.delete_template(template_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting template: {str(e)}"
        )

# Form submission endpoints
@router.post("/submissions", response_model=FormSubmission, status_code=status.HTTP_201_CREATED)
async def create_form_submission(submission_data: FormSubmissionCreate):
    """Create a new form submission"""
    try:
        submission = await FormSubmissionService.create_form_submission(submission_data)
        
        # Log activity
        await DashboardService.log_activity(
            submission_data.staff_id,
            f"Submitted {submission_data.template_name} form"
        )
        
        return submission
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating form submission: {str(e)}"
        )

@router.get("/submissions/staff/{staff_id}", response_model=List[FormSubmission])
async def get_form_submissions_by_staff(staff_id: str):
    """Get all form submissions for a staff member"""
    try:
        submissions = await FormSubmissionService.get_form_submissions_by_staff(staff_id)
        return submissions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving form submissions: {str(e)}"
        )

@router.get("/submissions/{submission_id}", response_model=FormSubmission)
async def get_form_submission(submission_id: str):
    """Get form submission by ID"""
    try:
        submission = await FormSubmissionService.get_form_submission(submission_id)
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form submission not found"
            )
        return submission
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving form submission: {str(e)}"
        )

@router.put("/submissions/{submission_id}", response_model=FormSubmission)
async def update_form_submission(submission_id: str, update_data: FormSubmissionUpdate):
    """Update form submission"""
    try:
        # Check if submission exists
        existing_submission = await FormSubmissionService.get_form_submission(submission_id)
        if not existing_submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form submission not found"
            )
        
        updated_submission = await FormSubmissionService.update_form_submission(submission_id, update_data)
        if not updated_submission:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update form submission"
            )
        
        # Log activity if status changed
        if update_data.status and update_data.status != existing_submission.status:
            await DashboardService.log_activity(
                existing_submission.staff_id,
                f"Updated {existing_submission.template_name} form status to {update_data.status.value}"
            )
        
        return updated_submission
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating form submission: {str(e)}"
        )

@router.delete("/submissions/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_form_submission(submission_id: str):
    """Delete form submission"""
    try:
        # Check if submission exists
        existing_submission = await FormSubmissionService.get_form_submission(submission_id)
        if not existing_submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form submission not found"
            )
        
        success = await FormSubmissionService.delete_form_submission(submission_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete form submission"
            )
        
        # Log activity
        await DashboardService.log_activity(
            existing_submission.staff_id,
            f"Deleted {existing_submission.template_name} form submission"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting form submission: {str(e)}"
        )