from app.database.connection import get_connection


def save_study_session(subject, duration_minutes):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO study_sessions (subject, duration_minutes)
        VALUES (?, ?)
    """, (subject, duration_minutes))

    connection.commit()
    connection.close()


def get_total_study_minutes(subject):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COALESCE(SUM(duration_minutes), 0)
        FROM study_sessions
        WHERE subject = ?
    """, (subject,))

    result = cursor.fetchone()[0]

    connection.close()

    return result