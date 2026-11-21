
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import LearningPlan from "./components/LearningPlan";
import AICoach from "./components/AICoach";
import QuizHistory from "./components/QuizHistory";
import StudyPlanHistory from "./components/StudyPlanHistory";
import TopicPerformance from "./components/TopicPerformance";
import QuizGenerator from "./components/QuizGenerator";
import StudyTracker from "./components/StudyTracker";

import {
  getQuizHistory,
  getTotalStudyHours
} from "./services/api";

import {
  Clock,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";

function App() {
  const [quizAverage, setQuizAverage] = useState(0);
  const [quizLoading, setQuizLoading] = useState(true);

  const [studyHours, setStudyHours] = useState(0);
  const [studyLoading, setStudyLoading] = useState(true);

  const [completedTopics, setCompletedTopics] = useState(0);

  async function loadQuizAverage() {
    try {
      const result = await getQuizHistory("Data Structures", "Arrays");
      const attempts = result.history || [];

      const totalScore = attempts.reduce(
        (sum, item) => sum + Number(item.score),
        0
      );

      setQuizAverage(
        attempts.length ? totalScore / attempts.length : 0
      );
    } catch (error) {
      console.error("Quiz average error:", error);
    } finally {
      setQuizLoading(false);
    }
  }

  async function loadCompletedTopics() {
    try {
      const topicNames = [
        "Arrays",
        "Linked Lists",
        "Trees",
        "Graphs"
      ];

      const results = await Promise.all(
        topicNames.map(async (topic) => {
          const data = await getQuizHistory("Data Structures", topic);
          const history = data.history || [];

          if (!history.length) return false;

          const average =
            history.reduce(
              (sum, item) => sum + Number(item.score),
              0
            ) / history.length;

          return average >= 80;
        })
      );

      setCompletedTopics(results.filter(Boolean).length);
    } catch (error) {
      console.error("Completed Topics Error:", error);
    }
  }

  async function loadStudyHours() {
    try {
      const result = await getTotalStudyHours("Data Structures");
      setStudyHours(result.total_hours);
    } catch (error) {
      console.error("Study Hours Error:", error);
    } finally {
      setStudyLoading(false);
    }
  }

  useEffect(() => {
    loadQuizAverage();
    loadCompletedTopics();
    loadStudyHours();
  }, []);

  async function handleQuizSubmitted() {
    await Promise.all([
      loadQuizAverage(),
      loadCompletedTopics()
    ]);
  }

  const stats = [
    {
      title: "Study Hours",
      value: studyLoading ? "Loading..." : `${studyHours} hrs`,
      subtitle: "Total learning time",
      icon: Clock
    },
    {
      title: "Completed Topics",
      value: completedTopics,
      subtitle: "Topics completed",
      icon: BookOpen
    },
    {
      title: "Quiz Average",
      value: quizLoading ? "Loading..." : `${quizAverage.toFixed(1)}%`,
      subtitle: "Your average score",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">

      <Sidebar />

      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10">

        <Header />

        <div className="mb-8 mt-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">
              AI Powered Learning
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Learning Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Track your progress and improve your learning with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          ))}
        </div>

        <LearningPlan />

        <TopicPerformance />

        <AICoach />

        <StudyTracker onSessionSaved={loadStudyHours} />

        <StudyPlanHistory />

        <QuizHistory />

        <QuizGenerator onQuizSubmitted={handleQuizSubmitted} />

        <footer className="text-center text-xs text-slate-400 py-8 mt-8 border-t border-slate-200">
          AI Study Planner & Learning Coach · Built with React, FastAPI & Gemini
        </footer>

      </main>
    </div>
  );
}

export default App;