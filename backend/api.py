
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Chains
from app.chains.syllabus_chain import analyze_syllabus
from app.chains.study_plan_chain import generate_study_plan
from app.chains.quiz_chain import generate_daily_quiz
from app.chains.evaluation_chain import evaluate_quiz
from app.chains.topic_performance_chain import analyze_topic_performance
from app.chains.revision_chain import generate_revision_plan
from app.chains.recommendation_chain import generate_learning_recommendations
from app.chains.progress_chain import track_student_progress
from app.chains.adaptive_study_plan_chain import generate_adaptive_study_plan
from app.schemas.topic_performance import WeakTopicReport

# Schemas
from app.schemas.syllabus import SyllabusAnalysis
from app.schemas.quiz import DailyQuiz

# Database
from app.database.connection import initialize_database
from app.database.study_plan_repository import (
    save_study_plan,
    get_study_plan_history
)
from app.database.quiz_repository import (
    save_quiz_attempt,
    get_quiz_history
)
from app.database.study_repository import (
    save_study_session,
    get_total_study_minutes
)


# Initialize FastAPI
app = FastAPI(
    title="AI Study Planner API",
    description="AI-powered personalized learning platform",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Database
initialize_database()


# =========================
# REQUEST MODELS
# =========================

class SyllabusRequest(BaseModel):
    subject: str
    syllabus: str


class StudyPlanRequest(BaseModel):
    subject: str
    analysis: SyllabusAnalysis
    total_days: int
    daily_hours: float


class QuizRequest(BaseModel):
    subject: str
    topic: str


class QuizEvaluationRequest(BaseModel):
    subject: str
    topic: str
    questions: list
    answers: list[str]


class TopicPerformanceRequest(BaseModel):
    topic_scores: dict[str, float]


class RevisionRequest(BaseModel):
    subject: str
    performance_report: dict


class RecommendationRequest(BaseModel):
    subject: str
    performance_report: dict
    revision_plan: dict


class ProgressRequest(BaseModel):
    subject: str
    previous_scores: dict[str, float]
    current_scores: dict[str, float]


class AdaptivePlanRequest(BaseModel):
    subject: str
    original_plan: dict
    performance_report: dict
    total_days: int
    daily_hours: float
class SaveStudyPlanRequest(BaseModel):
    subject: str
    plan_type: str
    plan_data: dict
class SaveQuizAttemptRequest(BaseModel):
    subject: str
    topic: str
    score: float
class StudySessionRequest(BaseModel):
    subject: str
    duration_minutes: int


# =========================
# HOME API
# =========================

@app.get("/")
def home():
    return {
        "message": "AI Study Planner API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# =========================
# SYLLABUS ANALYSIS API
# =========================

@app.post("/analyze-syllabus")
def syllabus_analysis(request: SyllabusRequest):
    try:
        result = analyze_syllabus(
            subject=request.subject,
            syllabus=request.syllabus
        )

        return {
            "success": True,
            "analysis": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# STUDY PLAN API
# =========================

@app.post("/generate-study-plan")
def create_study_plan(request: StudyPlanRequest):
    try:
        result = generate_study_plan(
            subject=request.subject,
            analysis=request.analysis.model_dump_json(),
            total_days=request.total_days,
            daily_hours=request.daily_hours
        )

        return {
            "success": True,
            "study_plan": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# QUIZ GENERATION API
# =========================

@app.post("/generate-quiz")
def create_quiz(request: QuizRequest):
    try:
        result = generate_daily_quiz(
            subject=request.subject,
            topic=request.topic
        )

        return {
            "success": True,
            "quiz": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# QUIZ EVALUATION API
# =========================

@app.post("/evaluate-quiz")
def evaluate_student_quiz(request: QuizEvaluationRequest):
    try:
        quiz = DailyQuiz(
            subject=request.subject,
            topic=request.topic,
            questions=request.questions
        )

        result = evaluate_quiz(
            quiz=quiz,
            student_answers=request.answers
        )

        # Save quiz score in database
        save_quiz_attempt(
            subject=request.subject,
            topic=request.topic,
            score=result.score_percentage
        )

        return {
            "success": True,
            "evaluation": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================
# TOPIC PERFORMANCE API
# =========================

@app.post("/analyze-performance")
def analyze_performance(request: TopicPerformanceRequest):
    try:
        result = analyze_topic_performance(
            request.topic_scores
        )

        return {
            "success": True,
            "performance_report": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))





# =========================
# LEARNING RECOMMENDATIONS API
# =========================

@app.post("/generate-recommendations")
def create_recommendations(request: RecommendationRequest):
    try:
        result = generate_learning_recommendations(
            subject=request.subject,
            performance_report=request.performance_report,
            revision_plan=request.revision_plan
        )

        return {
            "success": True,
            "recommendations": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================
# PROGRESS TRACKING API
# =========================

@app.post("/track-progress")
def track_progress(request: ProgressRequest):
    try:
        result = track_student_progress(
            subject=request.subject,
            previous_scores=request.previous_scores,
            current_scores=request.current_scores
        )

        return {
            "success": True,
            "progress": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================
# ADAPTIVE STUDY PLAN API
# =========================

@app.post("/generate-adaptive-plan")
def create_adaptive_plan(request: AdaptivePlanRequest):
    try:
        result = generate_adaptive_study_plan(
            subject=request.subject,
            original_plan=request.original_plan,
            performance_report=request.performance_report,
            total_days=request.total_days,
            daily_hours=request.daily_hours
        )

        return {
            "success": True,
            "adaptive_plan": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================
# SAVE STUDY PLAN
# =========================

@app.post("/save-study-plan")
def save_plan(request: SaveStudyPlanRequest):
    try:
        save_study_plan(
            subject=request.subject,
            plan_type=request.plan_type,
            plan_data=request.plan_data
        )

        return {
            "success": True,
            "message": "Study plan saved successfully!"
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# GET STUDY PLAN HISTORY
# =========================

@app.get("/study-plan-history")
def study_plan_history(subject: str):
    try:
        records = get_study_plan_history(subject)

        return {
            "success": True,
            "history": [
                {
                    "id": row[0],
                    "plan_type": row[1],
                    "plan_data": row[2],
                    "created_at": row[3]
                }
                for row in records
            ]
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# SAVE QUIZ ATTEMPT
# =========================

@app.post("/save-quiz-attempt")
def save_attempt(request: SaveQuizAttemptRequest):
    try:
        save_quiz_attempt(
            subject=request.subject,
            topic=request.topic,
            score=request.score
        )

        return {
            "success": True,
            "message": "Quiz attempt saved successfully!"
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# GET QUIZ HISTORY
# =========================

@app.get("/quiz-history")
def quiz_history(subject: str, topic: str):
    try:
        records = get_quiz_history(subject, topic)

        return {
            "success": True,
            "history": [
                {
                    "score": row[0],
                    "attempted_at": row[1]
                }
                for row in records
            ]
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# SAVE STUDY SESSION
# =========================

@app.post("/save-study-session")
def save_study_session_api(request: StudySessionRequest):

    if request.duration_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than 0"
        )

    try:
        save_study_session(
            subject=request.subject,
            duration_minutes=request.duration_minutes
        )

        return {
            "success": True,
            "message": "Study session saved successfully"
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================
# GET TOTAL STUDY HOURS
# =========================

@app.get("/total-study-hours")
def total_study_hours(subject: str):
    try:
        total_minutes = get_total_study_minutes(subject)

        return {
            "success": True,
            "total_minutes": total_minutes,
            "total_hours": round(total_minutes / 60, 2)
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
@app.post("/generate-revision-plan")
def create_revision_plan(request: RevisionRequest):
    try:
        topic_report = WeakTopicReport(
            **request.performance_report
        )

        result = generate_revision_plan(
            request.subject,
            topic_report
        )

        return {
            "success": True,
            "revision_plan": result.model_dump()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))