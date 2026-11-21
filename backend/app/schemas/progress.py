from pydantic import BaseModel
from typing import List


class TopicProgress(BaseModel):
    topic: str
    previous_score: float
    current_score: float
    improvement: float
    status: str


class StudentProgress(BaseModel):
    subject: str
    total_topics: int
    average_score: float
    overall_improvement: float
    topic_progress: List[TopicProgress]
    progress_message: str