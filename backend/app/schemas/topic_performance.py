from pydantic import BaseModel
from typing import List, Literal

class TopicPerformance(BaseModel):
    topic: str
    score_percentage: float
    status: Literal["Strong", "Average", "Weak"]
    recommendation: str
    
class WeakTopicReport(BaseModel):
    total_topics: int
    strong_topics: List[str]
    average_topics: List[str]
    weak_topics: List[str]
    topic_performance: List[TopicPerformance]
    revision_priority: List[str]
    