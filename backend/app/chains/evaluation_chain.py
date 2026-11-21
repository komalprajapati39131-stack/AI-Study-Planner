from app.schemas.evaluation import QuizEvaluation, QuestionResult


def evaluate_quiz(quiz, student_answers):

    results = []
    correct_count = 0

    for index, question in enumerate(quiz.questions):

        student_answer = student_answers[index]

        is_correct = (
            student_answer.strip().casefold()
            == question.correct_answer.strip().casefold()
        )

        if is_correct:
            correct_count += 1

        results.append(
            QuestionResult(
                question=question.question,
                student_answer=student_answer,
                correct_answer=question.correct_answer,
                is_correct=is_correct,
                explanation=question.explanation
            )
        )

    total_questions = len(quiz.questions)
    wrong_count = total_questions - correct_count

    score = (correct_count / total_questions) * 100

    if score >= 80:
        message = "Excellent! You have a strong understanding of this topic."
    elif score >= 60:
        message = "Good work! Revise a few concepts to improve."
    else:
        message = "Keep practicing! Review the explanations and try again."

    return QuizEvaluation(
        total_questions=total_questions,
        correct_answers=correct_count,
        wrong_answers=wrong_count,
        score_percentage=round(score, 2),
        results=results,
        performance_message=message
    )