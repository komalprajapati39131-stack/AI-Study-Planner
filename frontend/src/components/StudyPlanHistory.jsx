
import { useEffect, useState } from "react";
import { getStudyPlanHistory } from "../services/api";
import { History, BookOpen, CalendarDays, Sparkles } from "lucide-react";

function StudyPlanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getStudyPlanHistory("Data Structures");
        setHistory(result.history || []);
      } catch (err) {
        setError("Could not load study plan history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm mt-8">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <History size={23} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Study Plan History
          </h3>
          <p className="text-sm text-slate-500">
            Your previously generated learning plans
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-6 text-slate-500">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading history...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-xl">
          <BookOpen size={32} className="mx-auto text-slate-400 mb-3" />
          <p className="font-semibold text-slate-700">
            No study plans found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Your generated plans will appear here.
          </p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="p-3 bg-white text-indigo-600 rounded-xl">
                <Sparkles size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">
                  Data Structures
                </p>

                <p className="text-sm text-indigo-600 mt-1 font-medium">
                  Plan Type: {item.plan_type}
                </p>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <CalendarDays size={14} />
                  <span>{item.created_at}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default StudyPlanHistory;