from pydantic import BaseModel
from typing import List

class QuizQuestion(BaseModel):
    
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    
class DailyQuiz(BaseModel):
    
    subject: str
    topic: str
    questions: List[QuizQuestion]