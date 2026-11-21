
import { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  ListChecks,
  LoaderCircle,
  RefreshCw
} from "lucide-react";

import {
  getQuizHistory,
  analyzePerformance,
  generateRevisionPlan,
  generateRecommendations
} from "../services/api";

function AICoach() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGetRecommendation() {
    try {
      setLoading(true);
      setError("");
      setRecommendation(null);

      const topicNames = [
        "Arrays",
        "Linked Lists",
        "Trees",
        "Graphs"
      ];

      // Step 1: Fetch quiz history
      const results = await Promise.all(
        topicNames.map(async (topic) => {
          const data = await getQuizHistory(
            "Data Structures",
            topic
          );

          const history =
            data.history ||
            data.quiz_history ||
            data.attempts ||
            [];

          const average = history.length
            ? history.reduce(
                (sum, item) => sum + Number(item.score || 0),
                0
              ) / history.length
            : null;

          return { topic, average };
        })
      );

      // Step 2: Prepare topic scores
      const topicScores = {};

      results.forEach((item) => {
        if (item.average !== null) {
          topicScores[item.topic] = item.average;
        }
      });

      if (Object.keys(topicScores).length === 0) {
        setError(
          "Attempt at least one quiz to get AI recommendations."
        );
        return;
      }

      // Step 3: Analyze performance
      const performanceData =
        await analyzePerformance(topicScores);

      // Step 4: Generate revision plan
      const revisionData = await generateRevisionPlan(
        "Data Structures",
        performanceData.performance_report
      );

      // Step 5: Generate Gemini recommendations
      const recommendationData =
        await generateRecommendations(
          "Data Structures",
          performanceData.performance_report,
          revisionData.revision_plan
        );

      setRecommendation(recommendationData.recommendations);

    } catch (error) {
      console.error("AI Recommendation Error:", error);
      setError(
        "Unable to generate recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function getPriorityStyle(priority) {
    if (priority === "High") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (priority === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-green-50 text-green-700 border-green-100";
  }

  function getProgressColor(score) {
    if (score < 50) return "from-red-400 to-rose-500";
    if (score < 80) return "from-amber-400 to-orange-500";
    return "from-green-400 to-emerald-500";
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br
      from-indigo-700 via-indigo-600 to-violet-700
      text-white p-7 md:p-8 rounded-2xl mt-8 shadow-sm">

      {/* Decorative Background */}
      <div className="absolute -top-16 -right-16 w-56 h-56
        bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center
          justify-between gap-5 mb-6">

          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/15 rounded-2xl
              border border-white/10">
              <Brain size={28} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">
                  AI Learning Coach
                </h3>
                <Sparkles size={17} className="text-yellow-300" />
              </div>

              <p className="text-indigo-100 text-sm mt-1">
                Personalized recommendations powered by Gemini
              </p>
            </div>
          </div>

          <span className="text-xs font-medium bg-white/15
            border border-white/10 px-3 py-2 rounded-full w-fit">
            AI Powered
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-indigo-100 leading-6 mb-6 max-w-2xl">
          Get personalized learning actions, recommended resources
          and practice tasks based on your quiz performance.
        </p>

        {/* Generate Button */}
        <button
          onClick={handleGetRecommendation}
          disabled={loading}
          className="flex items-center justify-center gap-2
            bg-white text-indigo-700 px-5 py-3 rounded-xl
            font-semibold text-sm shadow-sm
            hover:bg-indigo-50 hover:shadow-md
            transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Analyzing Performance...
            </>
          ) : (
            <>
              {recommendation
                ? "Refresh Recommendations"
                : "Get AI Recommendation"}
              {recommendation
                ? <RefreshCw size={17} />
                : <ArrowRight size={18} />}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-500/20 border border-red-200/20
            rounded-xl p-4 text-sm text-red-50">
            {error}
          </div>
        )}

        {/* Gemini Response */}
        {recommendation && (
          <div className="mt-8 space-y-5">

            {/* Overall Feedback */}
            <div className="bg-white/10 border border-white/10
              backdrop-blur-sm p-5 rounded-2xl">

              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={19} className="text-yellow-300" />
                <h4 className="font-bold">
                  Gemini's Overall Feedback
                </h4>
              </div>

              <p className="text-sm text-indigo-100 leading-7">
                {recommendation.overall_feedback}
              </p>
            </div>

            {/* Topic Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {recommendation.recommendations?.map((item, index) => {
                const score = Math.min(
                  100,
                  Math.max(0, Number(item.current_score) || 0)
                );

                return (
                  <div
                    key={index}
                    className="bg-white text-slate-800 p-5
                      rounded-2xl shadow-sm hover:shadow-lg
                      transition-all duration-300"
                  >

                    {/* Topic Header */}
                    <div className="flex justify-between
                      items-start gap-3 mb-4">

                      <h4 className="font-bold text-lg">
                        {item.topic}
                      </h4>

                      <span className={`text-xs font-semibold
                        px-3 py-1.5 rounded-full border
                        ${getPriorityStyle(item.priority)}`}>
                        {item.priority} Priority
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex justify-between
                      items-center mb-2">

                      <span className="text-sm text-slate-500">
                        Current Performance
                      </span>

                      <span className="font-bold text-slate-800">
                        {Math.round(score)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100
                      rounded-full h-2.5 overflow-hidden mb-6">

                      <div
                        className={`h-2.5 rounded-full
                          bg-gradient-to-r
                          ${getProgressColor(score)}
                          transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    {/* Learning Action */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={18} className="text-indigo-600" />
                        <h5 className="font-semibold text-sm">
                          Learning Action
                        </h5>
                      </div>

                      <p className="text-sm text-slate-600 leading-6">
                        {item.learning_action}
                      </p>
                    </div>

                    {/* Resources */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} className="text-indigo-600" />
                        <h5 className="font-semibold text-sm">
                          Recommended Resources
                        </h5>
                      </div>

                      <ul className="list-disc pl-5 text-sm
                        text-slate-600 space-y-2">
                        {item.recommended_resources?.map(
                          (resource, i) => (
                            <li key={i}>{resource}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Practice Tasks */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ListChecks size={18} className="text-indigo-600" />
                        <h5 className="font-semibold text-sm">
                          Practice Tasks
                        </h5>
                      </div>

                      <ul className="list-disc pl-5 text-sm
                        text-slate-600 space-y-2">
                        {item.practice_tasks?.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Next Step */}
            <div className="bg-white/10 border border-white/10
              p-5 rounded-2xl">

              <div className="flex items-center gap-2 mb-3">
                <ArrowRight size={19} className="text-yellow-300" />
                <h4 className="font-bold">
                  Your Next Step
                </h4>
              </div>

              <p className="text-sm text-indigo-100 leading-7">
                {recommendation.next_step}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AICoach;