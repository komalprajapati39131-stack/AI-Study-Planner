from app.database.connection import get_connection


def save_topic_progress(subject, topic, progress):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO topic_progress (subject, topic, progress)
        VALUES (?, ?, ?)
        ON CONFLICT(subject, topic)
        DO UPDATE SET
            progress = excluded.progress,
            updated_at = CURRENT_TIMESTAMP
    """, (subject, topic, progress))

    connection.commit()
    connection.close()


def get_completed_topics(subject):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM topic_progress
        WHERE subject = ? AND progress >= 100
    """, (subject,))

    result = cursor.fetchone()[0]

    connection.close()

    return result