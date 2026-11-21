
import json

from app.database.connection import get_connection


def save_study_plan(subject, plan_type, plan_data):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO study_plans (subject, plan_type, plan_data)
        VALUES (?, ?, ?)
        """,
        (
            subject,
            plan_type,
            json.dumps(plan_data)
        )
    )

    connection.commit()
    connection.close()

    print(f"{plan_type} study plan saved successfully!")


def get_study_plan_history(subject):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, plan_type, plan_data, created_at
        FROM study_plans
        WHERE subject = ?
        ORDER BY id DESC
        """,
        (subject,)
    )

    records = cursor.fetchall()
    connection.close()

    return records
