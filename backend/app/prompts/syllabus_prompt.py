
from langchain_core.prompts import ChatPromptTemplate

syllabus_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
        You are an expert academic syllabus analyzer.

        Your job is to analyze a student's syllabus.

        Identify:
        1. Main topics
        2. Important subtopics
        3. Difficulty level (Easy, Medium, Hard)
        4. Recommended learning order
        5. Estimated study hours

        Give clear and student-friendly output.
        """
    ),
    (
        "human",
        """
        Subject: {subject}

        Syllabus:
        {syllabus}
        """
    )
])