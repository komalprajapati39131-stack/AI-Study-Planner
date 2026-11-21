
import json

from app.llm import llm
from app.schemas.study_plan import StudyPlan
from app.prompts.study_plan_prompt import study_plan_prompt


study_plan_llm = llm.with_structured_output(StudyPlan)

study_plan_chain = study_plan_prompt | study_plan_llm


def generate_study_plan(subject, analysis, total_days, daily_hours):

    # Extract required topics from syllabus analysis
    analysis_data = json.loads(analysis)

    required_topics = [
        topic["name"] for topic in analysis_data["topics"]
    ]

    validation_feedback = "No previous errors."
    max_retries = 3

    for attempt in range(max_retries):

        print(f"\nGenerating study plan... Attempt {attempt + 1}")

        try:
            response = study_plan_chain.invoke({
                "subject": subject,
                "analysis": analysis,
                "total_days": total_days,
                "daily_hours": daily_hours,
                "validation_feedback": validation_feedback
            })

            validated_plan = StudyPlan.model_validate(
                response.model_dump()
            )

            # Collect all topics from generated timetable
            planned_topics = {
                topic.strip().casefold()
                for session in validated_plan.sessions
                for topic in session.topics
            }

            # Find missing syllabus topics
            missing_topics = [
                topic for topic in required_topics
                if topic.strip().casefold() not in planned_topics
            ]

            if missing_topics:
                raise ValueError(
                    f"Missing syllabus topics: {missing_topics}. "
                    "Include all required topics in the timetable."
                )

            print("Study plan generated successfully!")
            return validated_plan

        except ValueError as error:

            validation_feedback = str(error)

            print("Validation failed!")
            print(validation_feedback)

    raise ValueError(
        "Could not generate a valid study plan after retries."
    )
