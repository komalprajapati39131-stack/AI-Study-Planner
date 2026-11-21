from pydantic import BaseModel
from typing import List, Literal
class Topic(BaseModel):
    name: str
    difficulty: Literal["easy", "medium", "hard"]
    estimated_hours: float
    
    learning_order: int
    
class SyllabusAnalysis(BaseModel):
    subject: str
    topics: List[Topic]