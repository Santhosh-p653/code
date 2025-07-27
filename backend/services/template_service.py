from typing import List, Optional
from datetime import datetime
from ..database import templates_collection, form_submissions_collection
from ..models import Template, TemplateCreate, FormSubmission, FormSubmissionCreate, FormSubmissionUpdate

class TemplateService:
    
    @staticmethod
    async def create_template(template_data: TemplateCreate) -> Template:
        """Create a new template"""
        template_dict = template_data.dict()
        template_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        template_dict["created_at"] = datetime.utcnow()
        template_dict["updated_at"] = datetime.utcnow()
        
        result = await templates_collection.insert_one(template_dict)
        
        created_template = await templates_collection.find_one({"_id": result.inserted_id})
        created_template.pop("_id", None)
        
        return Template(**created_template)
    
    @staticmethod
    async def get_template(template_id: str) -> Optional[Template]:
        """Get template by ID"""
        template = await templates_collection.find_one({"id": template_id})
        if template:
            template.pop("_id", None)
            return Template(**template)
        return None
    
    @staticmethod
    async def get_all_templates() -> List[Template]:
        """Get all templates"""
        templates = []
        cursor = templates_collection.find({})
        async for template in cursor:
            template.pop("_id", None)
            templates.append(Template(**template))
        return templates
    
    @staticmethod
    async def get_templates_by_category(category: str) -> List[Template]:
        """Get templates by category"""
        templates = []
        cursor = templates_collection.find({"category": category})
        async for template in cursor:
            template.pop("_id", None)
            templates.append(Template(**template))
        return templates
    
    @staticmethod
    async def delete_template(template_id: str) -> bool:
        """Delete template"""
        result = await templates_collection.delete_one({"id": template_id})
        return result.deleted_count > 0

class FormSubmissionService:
    
    @staticmethod
    async def create_form_submission(submission_data: FormSubmissionCreate) -> FormSubmission:
        """Create a new form submission"""
        submission_dict = submission_data.dict()
        submission_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        submission_dict["created_at"] = datetime.utcnow()
        submission_dict["updated_at"] = datetime.utcnow()
        
        result = await form_submissions_collection.insert_one(submission_dict)
        
        created_submission = await form_submissions_collection.find_one({"_id": result.inserted_id})
        created_submission.pop("_id", None)
        
        return FormSubmission(**created_submission)
    
    @staticmethod
    async def get_form_submission(submission_id: str) -> Optional[FormSubmission]:
        """Get form submission by ID"""
        submission = await form_submissions_collection.find_one({"id": submission_id})
        if submission:
            submission.pop("_id", None)
            return FormSubmission(**submission)
        return None
    
    @staticmethod
    async def get_form_submissions_by_staff(staff_id: str) -> List[FormSubmission]:
        """Get all form submissions for a staff member"""
        submissions = []
        cursor = form_submissions_collection.find({"staff_id": staff_id}).sort("created_at", -1)
        async for submission in cursor:
            submission.pop("_id", None)
            submissions.append(FormSubmission(**submission))
        return submissions
    
    @staticmethod
    async def update_form_submission(submission_id: str, update_data: FormSubmissionUpdate) -> Optional[FormSubmission]:
        """Update form submission"""
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        if not update_dict:
            return await FormSubmissionService.get_form_submission(submission_id)
        
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await form_submissions_collection.update_one(
            {"id": submission_id},
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await FormSubmissionService.get_form_submission(submission_id)
        return None
    
    @staticmethod
    async def delete_form_submission(submission_id: str) -> bool:
        """Delete form submission"""
        result = await form_submissions_collection.delete_one({"id": submission_id})
        return result.deleted_count > 0