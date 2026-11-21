
import { useState } from "react";
import { saveStudySession } from "../services/api";
import { Clock, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

function StudyTracker({ onSessionSaved }) {
  const [minutes, setMinutes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSaveSession() {
    if (!minutes || Number(minutes) <= 0 || !Number.isFinite(Number(minutes))) {
      setIsError(true);
      setMessage("Please enter valid study minutes.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      await saveStudySession("Data Structures", Number(minutes));

      if (onSessionSaved) {
        await onSessionSaved();
      }

      setIsError(false);
      setMessage("Study session saved successfully!");
      setMinutes("");
    } catch (error) {
      console.error("Study session error:", error);
      setIsError(true);
      setMessage("Unable to save study session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 mt-8">

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <Clock size={25} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Study Session Tracker
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Track your daily learning time
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-5">
        <label className="text-sm font-semibold text-slate-700">
          Study Duration
        </label>

        <div className="relative mt-2">
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => {
              setMinutes(e.target.value);
              setMessage("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveSession();
            }}
            placeholder="Enter minutes studied"
            className="w-full p-3.5 pr-20 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
            Minutes
          </span>
        </div>
      </div>

      <button
        onClick={handleSaveSession}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <BookOpen size={18} />
        {loading ? "Saving Session..." : "Save Study Session"}
      </button>

      {message && (
        <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-sm font-medium ${
          isError
            ? "bg-red-50 text-red-600"
            : "bg-green-50 text-green-700"
        }`}>
          {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {message}
        </div>
      )}
    </div>
  );
}

export default StudyTracker;