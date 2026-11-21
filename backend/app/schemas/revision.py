from pydantic import BaseModel
from typing import List, Literal

class RevisionTask(BaseModel):
    topic: str
    priority: Literal["High", "Medium", "Low"]
    
    current_score: float
    revision_focus: str
    practice_suggestion: str
    estimated_hours:float
    
class RevisionPlan(BaseModel):
    subject: str
    total_revision_hours: float
    tasks: List[RevisionTask]
    overall_message: str
    