
from app.schemas.study_plan import StudyPlan

# Test 1: Valid timetable
valid_data = {
    "subject": "Data Structures",
    "total_days": 2,
    "daily_hours_available": 3,
    "sessions": [
        {
            "day_number": 1,
            "topics": ["Arrays"],
            "total_hours": 2,
            "daily_goal": "Understand arrays"
        },
        {
            "day_number": 2,
            "topics": ["Linked Lists"],
            "total_hours": 3,
            "daily_goal": "Learn linked lists"
        }
    ]
}

plan = StudyPlan.model_validate(valid_data)

print("Valid timetable accepted!")
print(plan)


# Test 2: Invalid timetable
invalid_data = {
    "subject": "Data Structures",
    "total_days": 2,
    "daily_hours_available": 3,
    "sessions": [
        {
            "day_number": 1,
            "topics": ["Trees"],
            "total_hours": 5,
            "daily_goal": "Learn trees"
        }
    ]
}

try:
    StudyPlan.model_validate(invalid_data)

except ValueError as error:
    print("\nValidation failed!")
    print(error)
