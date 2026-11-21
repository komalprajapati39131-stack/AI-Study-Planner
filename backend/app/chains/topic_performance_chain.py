from app.schemas.topic_performance import (
    TopicPerformance,
    WeakTopicReport
)

def analyze_topic_performance(topic_scores):

    strong_topics = []
    average_topics = []
    weak_topics = []

    topic_performance = []

    for topic, score in topic_scores.items():

        if score >= 80:
            status = "Strong"
            recommendation = "Move to advanced questions."

            strong_topics.append(topic)

        elif score >= 50:
            status = "Average"
            recommendation = "Revise concepts and practice more questions."

            average_topics.append(topic)

        else:
            status = "Weak"
            recommendation = "Relearn fundamentals and solve basic questions."

            weak_topics.append(topic)

        topic_performance.append(
            TopicPerformance(
                topic=topic,
                score_percentage=score,
                status=status,
                recommendation=recommendation
            )
        )

    # Lowest scoring topics get highest revision priority
    revision_priority = sorted(
        topic_scores,
        key=topic_scores.get
    )

    return WeakTopicReport(
        total_topics=len(topic_scores),
        strong_topics=strong_topics,
        average_topics=average_topics,
        weak_topics=weak_topics,
        topic_performance=topic_performance,
        revision_priority=revision_priority
    )