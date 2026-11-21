
from app.llm import structured_llm
from app.prompts.syllabus_prompt import syllabus_prompt


# Connect Prompt with Structured LLM
syllabus_chain = syllabus_prompt | structured_llm


def analyze_syllabus(subject, syllabus):

    response = syllabus_chain.invoke({
        "subject": subject,
        "syllabus": syllabus
    })

    return response
