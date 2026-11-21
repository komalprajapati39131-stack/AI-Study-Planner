
import { useEffect, useState } from "react";
import { getQuizHistory } from "../services/api";
import {
  History,
  Trophy,
  Target,
  CalendarDays,
  ClipboardList
} from "lucide-react";

function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuizHistory() {
      try {
        const result = await getQuizHistory("Data Structures", "Arrays");
        setHistory(result.history || []);
      } catch (err) {
        setError("Could not load quiz history.");
      } finally {
        setLoading(false);
      }
    }

    loadQuizHistory();
  }, []);

  const overallAverage = history.length
    ? Math.round(
        history.reduce((sum, item) => sum + Number(item.score), 0) /
          history.length
      )
    : 0;

  const latestAttempt = history.length
    ? [...history].sort(
        (a, b) =>
          new Date(b.attempted_at) - new Date(a.attempted_at)
      )[0]
    : null;

  return (
    <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm mt-8">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <History size={23} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Quiz History
          </h3>
          <p className="text-sm text-slate-500">
            Track your quiz performance over time
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-slate-500 py-5">Loading quiz history...</p>
      )}

      {error && (
        <p className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </p>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-xl">
          <ClipboardList size={32} className="mx-auto text-slate-400 mb-3" />
          <p className="font-semibold text-slate-700">
            No quiz attempts found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Complete a quiz to see your performance here.
          </p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Overall Average</p>
                <Target size={20} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-indigo-600 mt-3">
                {overallAverage}%
              </h2>
            </div>

            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Latest Score</p>
                <Trophy size={20} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mt-3">
                {latestAttempt.score}%
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-800">
              Previous Attempts
            </h4>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {history.length} Attempts
            </span>
          </div>

          <div className="space-y-3">
            {[...history]
              .sort(
                (a, b) =>
                  new Date(b.attempted_at) - new Date(a.attempted_at)
              )
              .map((item, index) => (
                <div
                  key={item.id ?? `${item.attempted_at}-${index}`}
                  className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      Arrays Quiz
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <CalendarDays size={13} />
                      {item.attempted_at}
                    </p>
                  </div>

                  <span className={`text-sm font-bold px-3 py-2 rounded-lg ${
                    Number(item.score) >= 80
                      ? "bg-green-100 text-green-700"
                      : Number(item.score) >= 50
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.score}%
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default QuizHistory;
