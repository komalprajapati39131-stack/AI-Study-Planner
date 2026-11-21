from pydantic import BaseModel
from typing import List

class QuestionResult(BaseModel):
    question: str
    student_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str
    
class QuizEvaluation(BaseModel):
    total_questions: int
    correct_answers: int
    wrong_answers: int
    score_percentage: float
    results: List[QuestionResult]
    performance_message: str