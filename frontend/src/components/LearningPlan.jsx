
import { useEffect, useState } from "react";
import { getQuizHistory } from "../services/api";
import { BookOpen, ArrowRight } from "lucide-react";

function LearningPlan() {
  const [topics, setTopics] = useState([
    { name: "Arrays", progress: 0 },
    { name: "Linked Lists", progress: 0 },
    { name: "Trees", progress: 0 },
    { name: "Graphs", progress: 0 }
  ]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const updatedTopics = await Promise.all(
          topics.map(async (topic) => {
            const data = await getQuizHistory(
              "Data Structures",
              topic.name
            );

            const history =
              data.history || data.quiz_history || data.attempts || [];

            const average = history.length
              ? Math.round(
                  history.reduce(
                    (sum, item) => sum + Number(item.score),
                    0
                  ) / history.length
                )
              : 0;

            return { ...topic, progress: average };
          })
        );

        setTopics(updatedTopics);
      } catch (error) {
        console.error("Progress fetch error:", error);
      }
    }

    fetchProgress();
  }, []);

  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-200
      shadow-sm hover:shadow-md transition-all duration-300 mt-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen size={20} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Learning Plan
            </h3>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            Your topic-wise quiz performance
          </p>
        </div>

        <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600">
          View All
          <ArrowRight size={16} />
        </span>
      </div>

      <div className="space-y-7">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">
                {topic.name}
              </span>

              <span className="text-sm font-semibold text-slate-600">
                {topic.progress}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500
                  h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, topic.progress))}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningPlan;