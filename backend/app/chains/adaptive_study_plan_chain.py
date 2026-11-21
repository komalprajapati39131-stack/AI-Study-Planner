
import json

from app.llm import llm
from app.schemas.study_plan import StudyPlan
from app.prompts.adaptive_study_plan_prompt import (
    adaptive_study_plan_prompt
)


# Gemini structured output
adaptive_llm = llm.with_structured_output(StudyPlan)

# Prompt + LLM
adaptive_study_plan_chain = adaptive_study_plan_prompt | adaptive_llm


def generate_adaptive_study_plan(
    subject,
    original_plan,
    performance_report,
    total_days,
    daily_hours
):

    # Original timetable se required topics extract karna
    required_topics = {
        topic.strip().casefold()
        for session in original_plan["sessions"]
        for topic in session["topics"]
    }

    validation_feedback = "No previous validation errors."
    max_retries = 3

    for attempt in range(max_retries):

        print(f"\nGenerating adaptive plan... Attempt {attempt + 1}")

        try:
            response = adaptive_study_plan_chain.invoke({
                "subject": subject,
                "original_plan": json.dumps(
                    original_plan, indent=2
                ),
                "performance_report": json.dumps(
                    performance_report, indent=2
                ),
                "total_days": total_days,
                "daily_hours": daily_hours,
                "validation_feedback": validation_feedback
            })

            # Pydantic validation
            validated_plan = StudyPlan.model_validate(
                response.model_dump()
            )

            # Check subject
            if validated_plan.subject != subject:
                raise ValueError(
                    "Generated plan has an incorrect subject."
                )

            # Check total days
            if validated_plan.total_days != total_days:
                raise ValueError(
                    f"Expected {total_days} days, "
                    f"but AI returned {validated_plan.total_days}."
                )

            # Check available daily hours
            if abs(
                validated_plan.daily_hours_available - daily_hours
            ) > 0.001:
                raise ValueError(
                    "AI returned incorrect daily available hours."
                )

            # Check all required topics
            planned_topics = {
                topic.strip().casefold()
                for session in validated_plan.sessions
                for topic in session.topics
            }

            missing_topics = required_topics - planned_topics

            if missing_topics:
                raise ValueError(
                    f"Missing topics: {sorted(missing_topics)}"
                )

            # Check total number of sessions
            if len(validated_plan.sessions) != total_days:
                raise ValueError(
                    f"Expected {total_days} sessions, "
                    f"but received {len(validated_plan.sessions)}."
                )

            print("Adaptive study plan generated successfully!")

            return validated_plan

        except ValueError as error:
            validation_feedback = str(error)

            print("Validation failed!")
            print(validation_feedback)

    raise ValueError(
        "Could not generate a valid adaptive study plan after retries."
    )
