
from app.llm import llm

from app.prompts.quiz_prompt import quiz_prompt
from app.schemas.quiz import DailyQuiz


# Gemini ko DailyQuiz schema follow karne ke liye configure karna
quiz_llm = llm.with_structured_output(DailyQuiz)


# Prompt + LLM chain
quiz_chain = quiz_prompt | quiz_llm


# Function to generate daily quiz
def generate_daily_quiz(subject, topic):

    response = quiz_chain.invoke({
        "subject": subject,
        "topic": topic
    })

    return response
