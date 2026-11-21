from pydantic import BaseModel
from typing import List, Literal


class TopicRecommendation(BaseModel):
    topic: str
    current_score: float
    learning_action: str
    recommended_resources: List[str]
    practice_tasks: List[str]
    priority: Literal["High", "Medium", "Low"]


class LearningRecommendation(BaseModel):
    subject: str
    overall_feedback: str
    recommendations: List[TopicRecommendation]
    next_step: str