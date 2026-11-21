
from langchain_core.prompts import ChatPromptTemplate

study_plan_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
        You are an expert AI study planner.

        Your task is to create a personalized study timetable.

        Follow these rules:
        1. Divide the syllabus into daily study sessions.
        2. Prioritize difficult topics appropriately.
        3. Complete all topics before the exam date.
        4. Never exceed the student's available daily hours.
        5. Include a clear daily goal for every session.
        6. Distribute topics realistically.
        7. Return the result according to the required structured schema.
        8. Every session must stay within daily available hours.
        9. The sum of all session hours must be realistic.
        10. Cover all syllabus topics within the available days.
        11. If the syllabus cannot realistically fit, clearly prioritize topics.
        """
    ),
    
(
    "human",
    """
    Subject: {subject}

    Syllabus Analysis:
    {analysis}

    Days remaining until exam: {total_days}

    Available study hours per day: {daily_hours}

    Validation Feedback:
    {validation_feedback}

    If validation feedback is provided, correct the previous
    issues and generate a valid study plan.
    """
)

    
])
