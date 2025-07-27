from typing import List, Optional
from datetime import datetime
from ..database import voice_transcriptions_collection, voice_to_template_conversions_collection
from ..models import VoiceTranscription, VoiceTranscriptionCreate, VoiceToTemplateConversion, VoiceToTemplateConversionCreate

class VoiceService:
    
    @staticmethod
    async def create_voice_transcription(transcription_data: VoiceTranscriptionCreate) -> VoiceTranscription:
        """Create a new voice transcription"""
        transcription_dict = transcription_data.dict()
        transcription_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        transcription_dict["created_at"] = datetime.utcnow()
        
        result = await voice_transcriptions_collection.insert_one(transcription_dict)
        
        created_transcription = await voice_transcriptions_collection.find_one({"_id": result.inserted_id})
        created_transcription.pop("_id", None)
        
        return VoiceTranscription(**created_transcription)
    
    @staticmethod
    async def get_voice_transcription(transcription_id: str) -> Optional[VoiceTranscription]:
        """Get voice transcription by ID"""
        transcription = await voice_transcriptions_collection.find_one({"id": transcription_id})
        if transcription:
            transcription.pop("_id", None)
            return VoiceTranscription(**transcription)
        return None
    
    @staticmethod
    async def get_voice_transcriptions_by_staff(staff_id: str) -> List[VoiceTranscription]:
        """Get all voice transcriptions for a staff member"""
        transcriptions = []
        cursor = voice_transcriptions_collection.find({"staff_id": staff_id}).sort("created_at", -1)
        async for transcription in cursor:
            transcription.pop("_id", None)
            transcriptions.append(VoiceTranscription(**transcription))
        return transcriptions
    
    @staticmethod
    async def delete_voice_transcription(transcription_id: str) -> bool:
        """Delete voice transcription"""
        result = await voice_transcriptions_collection.delete_one({"id": transcription_id})
        return result.deleted_count > 0

class VoiceToTemplateService:
    
    @staticmethod
    async def create_voice_to_template_conversion(conversion_data: VoiceToTemplateConversionCreate) -> VoiceToTemplateConversion:
        """Create a new voice to template conversion"""
        conversion_dict = conversion_data.dict()
        conversion_dict["id"] = str(datetime.now().timestamp()).replace(".", "")
        conversion_dict["created_at"] = datetime.utcnow()
        
        result = await voice_to_template_conversions_collection.insert_one(conversion_dict)
        
        created_conversion = await voice_to_template_conversions_collection.find_one({"_id": result.inserted_id})
        created_conversion.pop("_id", None)
        
        return VoiceToTemplateConversion(**created_conversion)
    
    @staticmethod
    async def get_voice_to_template_conversion(conversion_id: str) -> Optional[VoiceToTemplateConversion]:
        """Get voice to template conversion by ID"""
        conversion = await voice_to_template_conversions_collection.find_one({"id": conversion_id})
        if conversion:
            conversion.pop("_id", None)
            return VoiceToTemplateConversion(**conversion)
        return None
    
    @staticmethod
    async def get_voice_to_template_conversions_by_staff(staff_id: str) -> List[VoiceToTemplateConversion]:
        """Get all voice to template conversions for a staff member"""
        conversions = []
        cursor = voice_to_template_conversions_collection.find({"staff_id": staff_id}).sort("created_at", -1)
        async for conversion in cursor:
            conversion.pop("_id", None)
            conversions.append(VoiceToTemplateConversion(**conversion))
        return conversions
    
    @staticmethod
    async def delete_voice_to_template_conversion(conversion_id: str) -> bool:
        """Delete voice to template conversion"""
        result = await voice_to_template_conversions_collection.delete_one({"id": conversion_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def process_voice_to_template(transcription: str, staff_id: str) -> dict:
        """Process voice transcription and extract template data (Mock AI processing)"""
        
        # Mock AI processing - in real implementation, this would use actual AI/LLM
        template_match = None
        extracted_data = {}
        
        transcription_lower = transcription.lower()
        
        # Simple keyword matching for template detection
        if any(keyword in transcription_lower for keyword in ['lesson plan', 'calculus', 'derivatives', 'teaching', 'objectives']):
            template_match = {
                "template_id": "template_1",
                "template_name": "Lesson Plan Template"
            }
            
            extracted_data = {
                "subject": VoiceToTemplateService._extract_value(transcription, ['calculus', 'mathematics', 'algebra', 'statistics'], 'Advanced Calculus'),
                "grade": VoiceToTemplateService._extract_value(transcription, ['grade 12', 'grade 11', 'grade 10', 'grade 9'], 'Grade 12'),
                "topic": VoiceToTemplateService._extract_value(transcription, ['derivatives', 'chain rule', 'product rule', 'integration'], 'Derivatives and Chain Rule'),
                "objectives": 'Students will understand and apply the chain rule and product rule for derivatives, and solve practical application problems.',
                "duration": VoiceToTemplateService._extract_value(transcription, ['60 minutes', '90 minutes', '45 minutes'], '60'),
                "materials": VoiceToTemplateService._extract_value(transcription, ['graphing calculators', 'textbooks', 'worksheets'], 'Graphing calculators, whiteboard, practice worksheets'),
                "activities": 'Introduction to chain rule concepts, guided practice problems, group work on real-world applications, individual practice time.',
                "assessment": 'Formative assessment through practice problems, exit ticket with 3 derivative problems using chain rule.'
            }
            
        elif any(keyword in transcription_lower for keyword in ['progress report', 'student', 'grade', 'performance']):
            template_match = {
                "template_id": "template_2",
                "template_name": "Student Progress Report"
            }
            
            extracted_data = {
                "studentName": VoiceToTemplateService._extract_value(transcription, ['john smith', 'jane doe', 'alex johnson'], 'John Smith'),
                "studentId": VoiceToTemplateService._extract_value(transcription, ['12345', '67890', '11111'], '12345'),
                "subject": VoiceToTemplateService._extract_value(transcription, ['mathematics', 'calculus', 'algebra'], 'Mathematics'),
                "period": VoiceToTemplateService._extract_value(transcription, ['quarter 2', 'quarter 1', 'semester 1'], 'Quarter 2'),
                "grade": VoiceToTemplateService._extract_value(transcription, ['b+', 'a-', 'b', 'a'], 'B+'),
                "strengths": 'Shows strong analytical and problem-solving skills, actively participates in class discussions.',
                "improvements": 'Needs to show more detailed work steps in problem-solving, improve time management during tests.',
                "recommendations": 'Continue practicing step-by-step problem solving, consider additional practice with timed exercises.'
            }
            
        elif any(keyword in transcription_lower for keyword in ['meeting', 'attendees', 'agenda', 'minutes']):
            template_match = {
                "template_id": "template_3",
                "template_name": "Meeting Minutes Template"
            }
            
            extracted_data = {
                "meetingTitle": VoiceToTemplateService._extract_value(transcription, ['mathematics department', 'staff meeting', 'curriculum review'], 'Mathematics Department Meeting'),
                "date": datetime.now().strftime('%Y-%m-%d'),
                "time": '14:00',
                "attendees": VoiceToTemplateService._extract_value(transcription, ['dr. johnson', 'mr. peterson', 'ms. chen'], 'Dr. Johnson, Mr. Peterson, Ms. Chen'),
                "agenda": 'Review of new curriculum standards, implementation of weekly assessments, resource allocation discussion.',
                "discussions": 'Detailed discussion on new state curriculum requirements and how to align our current teaching methods.',
                "decisions": 'Implement weekly assessments starting next month, allocate budget for new graphing calculators.',
                "actionItems": 'Dr. Johnson - prepare assessment schedule, Mr. Peterson - research calculator options, Ms. Chen - draft new lesson plan templates.'
            }
        
        return {
            "template_match": template_match,
            "extracted_data": extracted_data,
            "confidence": 0.85 if template_match else 0.0
        }
    
    @staticmethod
    def _extract_value(text: str, keywords: List[str], default_value: str) -> str:
        """Extract value from text based on keywords"""
        text_lower = text.lower()
        for keyword in keywords:
            if keyword.lower() in text_lower:
                return keyword
        return default_value