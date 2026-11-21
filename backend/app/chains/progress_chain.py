from app.schemas.progress import TopicProgress, StudentProgress


def track_student_progress(subject, previous_scores, current_scores):

    topic_progress = []

    for topic, current_score in current_scores.items():

        previous_score = previous_scores.get(topic, 0)

        improvement = round(current_score - previous_score, 2)

        if improvement > 0:
            status = "Improved"
        elif improvement < 0:
            status = "Declined"
        else:
            status = "No Change"

        topic_progress.append(
            TopicProgress(
                topic=topic,
                previous_score=previous_score,
                current_score=current_score,
                improvement=improvement,
                status=status
            )
        )

    average_score = (
        sum(current_scores.values()) / len(current_scores)
        if current_scores else 0
    )

    overall_improvement = (
        sum(item.improvement for item in topic_progress)
        / len(topic_progress)
        if topic_progress else 0
    )

    if overall_improvement > 0:
        message = "Great progress! Keep practicing."
    elif overall_improvement < 0:
        message = "Your performance has declined. Focus on revision."
    else:
        message = "Your performance is stable. Keep improving."

    return StudentProgress(
        subject=subject,
        total_topics=len(topic_progress),
        average_score=round(average_score, 2),
        overall_improvement=round(overall_improvement, 2),
        topic_progress=topic_progress,
        progress_message=message
    )