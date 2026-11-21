from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import GOOGLE_API_KEY
from app.schemas.syllabus import SyllabusAnalysis

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)
structured_llm = llm.with_structured_output(SyllabusAnalysis)