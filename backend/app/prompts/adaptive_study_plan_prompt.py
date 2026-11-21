
from langchain_core.prompts import ChatPromptTemplate

adaptive_study_plan_prompt = ChatPromptTemplate.from_messages([

    ("system", """
        You are an expert adaptive learning planner.

        Your job is to update a student's study timetable
        based on their academic performance.

        Follow these rules:

        1. Give more study time to weak topics.
        2. Give moderate practice to average topics.
        3. Give advanced practice to strong topics.
        4. Include every required syllabus topic.
        5. Never exceed daily available study hours.
        6. Create realistic daily learning goals.
        7. Distribute topics across the available days.
        8. Use the student's performance report to
           personalize the timetable.
        9. Return output according to the StudyPlan schema.
    """),

    ("human", """
        Subject: {subject}

        Original Study Plan:
        {original_plan}

        Student Performance:
        {performance_report}

        Available Days: {total_days}
        Daily Available Hours: {daily_hours}

        Previous Validation Feedback:
        {validation_feedback}

        Generate an improved adaptive study timetable.
    """)
])
