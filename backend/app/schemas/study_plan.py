
from pydantic import BaseModel, model_validator
from typing import List


class StudySession(BaseModel):
    day_number: int
    topics: List[str]
    total_hours: float
    daily_goal: str


class StudyPlan(BaseModel):
    subject: str
    total_days: int
    daily_hours_available: float
    sessions: List[StudySession]

    @model_validator(mode="after")
    def validate_study_hours(self):

        for session in self.sessions:
            if session.total_hours > self.daily_hours_available:
                raise ValueError(
                    f"Day {session.day_number} exceeds available study hours!"
                )

        return self

    @model_validator(mode="after")
    def validate_day_numbers(self):

        day_numbers = [
            session.day_number for session in self.sessions
        ]

        expected_days = list(range(1, self.total_days + 1))

        if sorted(day_numbers) != expected_days:
            raise ValueError(
                "Study plan must contain unique and continuous day numbers."
            )

        return self
