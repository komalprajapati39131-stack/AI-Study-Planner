
import { useEffect, useState } from "react";
import { getQuizHistory } from "../services/api";
import { ChartNoAxesCombined } from "lucide-react";

function TopicPerformance() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const topicNames = ["Arrays", "Linked Lists", "Trees", "Graphs"];

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const results = await Promise.all(
          topicNames.map(async (topic) => {
            const data = await getQuizHistory("Data Structures", topic);
            const history = data.history || [];

            const average = history.length
              ? history.reduce(
                  (sum, item) => sum + Number(item.score || 0),
                  0
                ) / history.length
              : 0;

            return {
              name: topic,
              score: Math.round(average),
              attempts: history.length
            };
          })
        );

        setTopics(results);
      } catch (error) {
        console.error("Performance error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformance();
  }, []);

  function getStatus(score, attempts) {
    if (attempts === 0) return "Not Attempted";
    if (score < 50) return "Weak";
    if (score < 80) return "Average";
    return "Strong";
  }

  function getStatusStyle(status) {
    switch (status) {
      case "Weak":
        return "bg-red-50 text-red-600";

      case "Average":
        return "bg-amber-50 text-amber-600";

      case "Strong":
        return "bg-green-50 text-green-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  }

  function getProgressColor(status) {
    switch (status) {
      case "Weak":
        return "from-red-400 to-rose-500";

      case "Average":
        return "from-amber-400 to-orange-500";

      case "Strong":
        return "from-green-400 to-emerald-500";

      default:
        return "from-slate-300 to-slate-400";
    }
  }

  if (loading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200">
        <p className="text-slate-500 animate-pulse">
          Loading performance...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-200
      shadow-sm hover:shadow-md transition-all duration-300 mt-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <ChartNoAxesCombined size={21} />
        </div>

        <h3 className="text-xl font-bold text-slate-800">
          Topic-wise Performance
        </h3>
      </div>

      <p className="text-sm text-slate-500 mb-8">
        Your average quiz scores across topics
      </p>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map((topic) => {
          const status = getStatus(topic.score, topic.attempts);

          return (
            <div
              key={topic.name}
              className="p-5 rounded-xl border border-slate-100
                bg-slate-50/70 hover:bg-white hover:border-indigo-200
                hover:shadow-sm transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {topic.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {topic.attempts} quiz attempts
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${getStatusStyle(status)}`}>
                  {status}
                </span>
              </div>

              <div className="flex items-end justify-between mb-3">
                <p className="text-3xl font-bold text-slate-800">
                  {topic.attempts > 0 ? `${topic.score}%` : "--"}
                </p>

                <p className="text-xs text-slate-400 mb-1">
                  Average Score
                </p>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r
                    ${getProgressColor(status)}
                    transition-all duration-700`}
                  style={{
                    width: `${Math.min(100, Math.max(0, topic.score))}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopicPerformance;