from app.database.connection import get_connection


def save_quiz_attempt(subject, topic, score):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO quiz_attempts (subject, topic, score)
        VALUES (?, ?, ?)
        """,
        (subject, topic, score)
    )

    connection.commit()
    connection.close()

    print("Quiz attempt saved successfully!")
    
    
    
def get_quiz_history(subject, topic):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT score, attempted_at
        FROM quiz_attempts
        WHERE subject = ? AND topic = ?
        ORDER BY attempted_at ASC
        """,
        (subject, topic)
    )

    records = cursor.fetchall()

    connection.close()

    return records