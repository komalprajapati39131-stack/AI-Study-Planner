from langchain_core.prompts import ChatPromptTemplate

quiz_prompt = ChatPromptTemplate.from_messages([
    ("system", """
        You are an expert quiz generator and academic tutor.

        Your task is to generate a daily quiz for students.

        Follow these rules:
        1. Generate exactly 5 questions.
        2. Each question must have 4 options.
        3. Only one option should be correct.
        4. Questions should test conceptual understanding.
        5. Include a clear explanation for every answer.
        6. Questions should match the given subject and topic.
        7. Avoid repeating similar questions.
    """),

    ("human", """
        Subject: {subject}
        Topic: {topic}

        Generate a quiz based on this information.
    """)
])