
import json

# ==============================
# CHAIN IMPORTS
# ==============================

from app.chains.syllabus_chain import analyze_syllabus
from app.chains.study_plan_chain import generate_study_plan
from app.chains.quiz_chain import generate_daily_quiz
from app.chains.evaluation_chain import evaluate_quiz
from app.chains.topic_performance_chain import analyze_topic_performance
from app.chains.revision_chain import generate_revision_plan
from app.chains.recommendation_chain import generate_learning_recommendations
from app.chains.progress_chain import track_student_progress
from app.chains.adaptive_study_plan_chain import generate_adaptive_study_plan


# ==============================
# DATABASE IMPORTS
# ==============================

from app.database.connection import initialize_database

from app.database.quiz_repository import (
    get_quiz_history,
    save_quiz_attempt
)

from app.database.study_plan_repository import (
    save_study_plan,
    get_study_plan_history
)


# ==============================
# STUDENT INPUT
# ==============================

subject = "Data Structures"

syllabus = """
1. Arrays
2. Linked Lists
3. Stack and Queue
4. Trees
5. Graphs
"""

total_days = 10
daily_hours = 3


# Initialize database
initialize_database()


# ==============================
# STEP 1: SYLLABUS ANALYSIS
# ==============================

print("\n===== SYLLABUS ANALYSIS =====\n")

analysis = analyze_syllabus(subject, syllabus)

for topic in analysis.topics:
    print(topic.name, "-", topic.difficulty)


# ==============================
# STEP 2: GENERATE STUDY PLAN
# ==============================

print("\n===== AI STUDY TIMETABLE =====\n")

study_plan = generate_study_plan(
    subject=subject,
    analysis=analysis.model_dump_json(),
    total_days=total_days,
    daily_hours=daily_hours
)


# ==============================
# STEP 3: DISPLAY STUDY PLAN
# ==============================

print("Subject:", study_plan.subject)
print("Total Days:", study_plan.total_days)
print("Daily Available Hours:", study_plan.daily_hours_available)

for session in study_plan.sessions:
    print("\nDay:", session.day_number)
    print("Topics:", session.topics)
    print("Hours:", session.total_hours)
    print("Goal:", session.daily_goal)


# ==============================
# STEP 4: GENERATE DAILY QUIZ
# ==============================

print("\n===== AI DAILY QUIZ =====\n")

quiz = generate_daily_quiz(
    subject=subject,
    topic="Arrays"
)

print("Subject:", quiz.subject)
print("Topic:", quiz.topic)


# ==============================
# STEP 5: STUDENT QUIZ ATTEMPT
# ==============================

print("\n===== STUDENT QUIZ ATTEMPT =====\n")

student_answers = []

for index, question in enumerate(quiz.questions, start=1):

    print(f"\nQ{index}. {question.question}")

    for option_index, option in enumerate(question.options, start=1):
        print(f"{option_index}. {option}")

    while True:

        answer = input("Enter your answer (1-4): ")

        if not answer.isdigit():
            print("Please enter a valid number!")
            continue

        selected_index = int(answer) - 1

        if selected_index < 0 or selected_index >= len(question.options):
            print("Please select a valid option!")
            continue

        student_answers.append(question.options[selected_index])
        break


# ==============================
# STEP 6: QUIZ EVALUATION
# ==============================

print("\n===== QUIZ EVALUATION =====\n")

evaluation = evaluate_quiz(quiz, student_answers)

print("Total Questions:", evaluation.total_questions)
print("Correct Answers:", evaluation.correct_answers)
print("Wrong Answers:", evaluation.wrong_answers)
print("Score:", evaluation.score_percentage, "%")

print("\nPerformance:", evaluation.performance_message)


# ==============================
# STEP 7: DETAILED RESULTS
# ==============================

for index, result in enumerate(evaluation.results, start=1):

    print(f"\nQ{index}. {result.question}")
    print("Your Answer:", result.student_answer)
    print("Correct Answer:", result.correct_answer)
    print("Status:", "Correct" if result.is_correct else "Wrong")
    print("Explanation:", result.explanation)


# ==============================
# STEP 8: TOPIC-WISE PERFORMANCE
# ==============================

topic_scores = {
    "Arrays": evaluation.score_percentage
}


# ==============================
# STEP 9: WEAK TOPIC ANALYSIS
# ==============================

print("\n===== WEAK TOPIC ANALYSIS =====\n")

topic_report = analyze_topic_performance(topic_scores)

print("Total Topics:", topic_report.total_topics)
print("\nStrong Topics:", topic_report.strong_topics)
print("Average Topics:", topic_report.average_topics)
print("Weak Topics:", topic_report.weak_topics)


# ==============================
# STEP 10: DETAILED PERFORMANCE
# ==============================

print("\n===== DETAILED TOPIC PERFORMANCE =====")

for performance in topic_report.topic_performance:

    print("\nTopic:", performance.topic)
    print("Score:", performance.score_percentage, "%")
    print("Status:", performance.status)
    print("Recommendation:", performance.recommendation)

print("\nRevision Priority:", topic_report.revision_priority)


# ==============================
# STEP 11: REVISION PLAN
# ==============================

print("\n===== PERSONALIZED REVISION PLAN =====\n")

revision_plan = generate_revision_plan(
    subject=subject,
    topic_report=topic_report
)

print("Subject:", revision_plan.subject)
print("Total Revision Hours:", revision_plan.total_revision_hours)

for task in revision_plan.tasks:

    print("\nTopic:", task.topic)
    print("Score:", task.current_score)
    print("Priority:", task.priority)
    print("Revision Focus:", task.revision_focus)
    print("Practice:", task.practice_suggestion)
    print("Estimated Hours:", task.estimated_hours)

print("\nOverall Message:", revision_plan.overall_message)


# ==============================
# STEP 12: AI LEARNING RECOMMENDATIONS
# ==============================

print("\n===== AI LEARNING RECOMMENDATIONS =====\n")

recommendation = generate_learning_recommendations(
    subject=subject,
    performance_report=topic_report.model_dump(),
    revision_plan=revision_plan.model_dump()
)

print("Overall Feedback:", recommendation.overall_feedback)

for item in recommendation.recommendations:

    print("\nTopic:", item.topic)
    print("Score:", item.current_score)
    print("Priority:", item.priority)
    print("Learning Action:", item.learning_action)

    print("\nResources:")
    for resource in item.recommended_resources:
        print("-", resource)

    print("\nPractice Tasks:")
    for task in item.practice_tasks:
        print("-", task)

print("\nNext Step:", recommendation.next_step)


# ==============================
# STEP 13: ADAPTIVE STUDY PLAN
# ==============================

print("\n===== ADAPTIVE STUDY PLAN =====\n")

adaptive_plan = generate_adaptive_study_plan(
    subject=subject,
    original_plan=study_plan.model_dump(),
    performance_report=topic_report.model_dump(),
    total_days=total_days,
    daily_hours=daily_hours
)

print("Subject:", adaptive_plan.subject)
print("Total Days:", adaptive_plan.total_days)

for session in adaptive_plan.sessions:

    print("\nDay:", session.day_number)
    print("Topics:", session.topics)
    print("Hours:", session.total_hours)
    print("Goal:", session.daily_goal)


# ==============================
# STEP 14: SAVE STUDY PLANS
# ==============================

print("\n===== SAVING STUDY PLANS =====\n")

save_study_plan(
    subject=subject,
    plan_type="Original",
    plan_data=study_plan.model_dump()
)

save_study_plan(
    subject=subject,
    plan_type="Adaptive",
    plan_data=adaptive_plan.model_dump()
)


# ==============================
# STEP 15: STUDY PLAN HISTORY
# ==============================

print("\n===== STUDY PLAN HISTORY =====\n")

history = get_study_plan_history(subject)

for record in history:

    plan_id, plan_type, plan_data, created_at = record

    saved_plan = json.loads(plan_data)

    print("\nPlan ID:", plan_id)
    print("Plan Type:", plan_type)
    print("Created At:", created_at)
    print("Subject:", saved_plan["subject"])

    for session in saved_plan["sessions"]:

        print("\nDay:", session["day_number"])
        print("Topics:", session["topics"])
        print("Hours:", session["total_hours"])
        print("Goal:", session["daily_goal"])

    print("-" * 40)


# ==============================
# STEP 16: STUDENT PROGRESS TRACKING
# ==============================

print("\n===== STUDENT PROGRESS TRACKING =====\n")

previous_scores = {}
current_scores = {}

for performance in topic_report.topic_performance:

    topic = performance.topic

    history = get_quiz_history(subject, topic)

    if history:
        previous_scores[topic] = history[-1][0]
    else:
        previous_scores[topic] = performance.score_percentage

    current_scores[topic] = performance.score_percentage


progress = track_student_progress(
    subject=subject,
    previous_scores=previous_scores,
    current_scores=current_scores
)

print("Subject:", progress.subject)
print("Total Topics:", progress.total_topics)
print("Average Score:", progress.average_score, "%")
print("Overall Improvement:", progress.overall_improvement, "%")

for item in progress.topic_progress:

    print("\nTopic:", item.topic)
    print("Previous Score:", item.previous_score)
    print("Current Score:", item.current_score)
    print("Improvement:", item.improvement)
    print("Status:", item.status)

print("\nProgress Message:", progress.progress_message)


# ==============================
# STEP 17: SAVE QUIZ ATTEMPT
# ==============================

save_quiz_attempt(
    subject=subject,
    topic=quiz.topic,
    score=evaluation.score_percentage
)

print("\nQuiz attempt saved in database successfully!")


# ==============================
# PROJECT COMPLETED
# ==============================

print("\n===== AI STUDY PLANNER COMPLETED =====")
