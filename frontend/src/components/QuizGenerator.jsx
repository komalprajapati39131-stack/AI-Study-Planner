
import { useState } from "react";
import { generateQuiz, evaluateQuiz } from "../services/api";

function QuizGenerator({ onQuizSubmitted }) {
  const [subject, setSubject] = useState("Data Structures");
  const [topic, setTopic] = useState("Arrays");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Generate Quiz
  async function handleGenerateQuiz() {
    try {
      setLoading(true);
      setError("");
      setQuiz(null);
      setEvaluation(null);

      const result = await generateQuiz(subject, topic);

      setQuiz(result.quiz);
      setAnswers(result.quiz.questions.map(() => ""));
    } catch (error) {
      console.error(error);
      setError("Quiz generate nahi ho paya. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Select Answer
  function handleAnswerChange(questionIndex, selectedAnswer) {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
  }

  // Submit Quiz
  async function handleSubmitQuiz() {
    if (answers.some((answer) => answer === "")) {
      setError("Please answer all questions first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await evaluateQuiz(
        subject,
        topic,
        quiz.questions,
        answers
      );

      setEvaluation(result.evaluation);

      // Refresh dashboard after quiz submission
      if (onQuizSubmitted) {
        await onQuizSubmitted();
      }
    } catch (error) {
      console.error(error);
      setError("Quiz evaluation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6">
        AI Quiz Generator
      </h2>

      {/* Subject Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Subject
        </label>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg p-3"
          placeholder="Enter subject"
        />
      </div>

      {/* Topic Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Topic
        </label>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border rounded-lg p-3"
          placeholder="Enter topic"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateQuiz}
        disabled={loading || !subject.trim() || !topic.trim()}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {/* Error */}
      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}

      {/* Quiz Questions */}
      {quiz && !evaluation && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold">
            {quiz.subject} - {quiz.topic}
          </h3>

          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="border rounded-xl p-5"
            >
              <h4 className="font-semibold mb-4">
                {index + 1}. {question.question}
              </h4>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() =>
                        handleAnswerChange(index, option)
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Evaluating..." : "Submit Quiz"}
          </button>
        </div>
      )}

      {/* Evaluation Result */}
      {evaluation && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800">
              Quiz Completed!
            </h3>
            <p className="text-slate-500 mt-1">
              Here's how you performed
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-indigo-50 rounded-2xl p-8 text-center">
            <div className="text-5xl font-bold text-indigo-600">
              {evaluation.score_percentage}%
            </div>

            <p className="text-slate-600 mt-2">
              Your Quiz Score
            </p>

            <div className="w-full bg-slate-200 rounded-full h-3 mt-5">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${evaluation.score_percentage}%`
                }}
              />
            </div>

            <p className="font-medium text-slate-700 mt-4">
              {evaluation.performance_message}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-5 rounded-xl text-center">
              <p className="text-3xl font-bold text-green-600">
                {evaluation.correct_answers}
              </p>
              <p className="text-slate-600 mt-1">
                Correct Answers
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded-xl text-center">
              <p className="text-3xl font-bold text-red-600">
                {evaluation.wrong_answers}
              </p>
              <p className="text-slate-600 mt-1">
                Wrong Answers
              </p>
            </div>

            <div className="bg-indigo-50 p-5 rounded-xl text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {evaluation.total_questions}
              </p>
              <p className="text-slate-600 mt-1">
                Total Questions
              </p>
            </div>
          </div>

          {/* Detailed Review */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Answer Review
            </h3>

            <div className="space-y-4">
              {evaluation.results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-5 ${
                    result.is_correct
                      ? "border-green-200 bg-green-50/40"
                      : "border-red-200 bg-red-50/40"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <h4 className="font-semibold text-slate-800">
                      {index + 1}. {result.question}
                    </h4>

                    <span
                      className={`text-sm font-semibold shrink-0 ${
                        result.is_correct
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.is_correct ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <strong>Your Answer:</strong>{" "}
                      {result.student_answer}
                    </p>

                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      <span className="text-green-700">
                        {result.correct_answer}
                      </span>
                    </p>

                    <div className="bg-white rounded-lg p-3 mt-3">
                      <p className="font-semibold text-slate-700 mb-1">
                        Explanation
                      </p>
                      <p className="text-slate-600">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate New Quiz */}
          <button
            onClick={handleGenerateQuiz}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Generate New Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizGenerator;