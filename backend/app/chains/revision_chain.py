from app.schemas.revision import RevisionTask, RevisionPlan


def generate_revision_plan(subject, topic_report):

    tasks = []

    for performance in topic_report.topic_performance:

        score = performance.score_percentage

        if score < 50:
            priority = "High"
            focus = "Revise fundamental concepts and understand the basics."
            practice = "Solve 10 basic questions and 5 conceptual problems."
            hours = 2.0

        elif score < 80:
            priority = "Medium"
            focus = "Revise important concepts and identify knowledge gaps."
            practice = "Solve 10 intermediate-level questions."
            hours = 1.5

        else:
            priority = "Low"
            focus = "Strengthen advanced concepts."
            practice = "Solve 5 advanced-level questions."
            hours = 1.0

        tasks.append(
            RevisionTask(
                topic=performance.topic,
                priority=priority,
                current_score=score,
                revision_focus=focus,
                practice_suggestion=practice,
                estimated_hours=hours
            )
        )

    total_hours = sum(
        task.estimated_hours for task in tasks
    )

    tasks.sort(
        key=lambda task: task.current_score
    )

    return RevisionPlan(
        subject=subject,
        total_revision_hours=total_hours,
        tasks=tasks,
        overall_message="Follow your revision priorities and practice consistently."
    )