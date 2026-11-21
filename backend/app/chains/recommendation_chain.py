import json

from app.llm import llm
from app.schemas.recommendation import LearningRecommendation
from app.prompts.recommendation_prompt import recommendation_prompt


# Connect Gemini with Pydantic schema
recommendation_llm = llm.with_structured_output(
    LearningRecommendation
)


# Create LangChain pipeline
recommendation_chain = recommendation_prompt | recommendation_llm


def generate_learning_recommendations(
    subject,
    performance_report,
    revision_plan
):

    response = recommendation_chain.invoke({

        "subject": subject,

        "performance_report": json.dumps(
            performance_report,
            indent=2
        ),

        "revision_plan": json.dumps(
            revision_plan,
            indent=2
        )
    })

    return response