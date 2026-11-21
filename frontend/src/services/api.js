const API_BASE_URL = "http://127.0.0.1:8000";

// Get Study Plan History
export async function getStudyPlanHistory(subject) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/study-plan-history?subject=${encodeURIComponent(subject)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch study plan history");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Get Quiz History
export async function getQuizHistory(subject, topic) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/quiz-history?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quiz history");
    }

    return await response.json();
  } catch (error) {
    console.error("Quiz API Error:", error);
    throw error;
  }
}

// Get Total Study Hours
export async function getTotalStudyHours(subject) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/total-study-hours?subject=${encodeURIComponent(subject)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch study hours");
    }

    return await response.json();
  } catch (error) {
    console.error("Study Hours API Error:", error);
    throw error;
  }
}

// Generate Quiz
export async function generateQuiz(subject, topic) {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      topic,
    }),
  });

  if (!response.ok) {
    throw new Error("Quiz generation failed");
  }

  return await response.json();
}

// Evaluate Quiz
export async function evaluateQuiz(subject, topic, questions, answers) {
  const response = await fetch(`${API_BASE_URL}/evaluate-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      topic,
      questions,
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error("Quiz evaluation failed");
  }

  return await response.json();
}
export async function analyzePerformance(topicScores) {
  const response = await fetch(`${API_BASE_URL}/analyze-performance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic_scores: topicScores }),
  });

  if (!response.ok) throw new Error("Performance analysis failed");
  return await response.json();
}

export async function generateRevisionPlan(
  subject,
  performanceReport
) {
  const response = await fetch(`${API_BASE_URL}/generate-revision-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject,
      performance_report: performanceReport
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Revision plan generation failed");
  }

  return data;
}

export async function generateRecommendations(
  subject,
  performanceReport,
  revisionPlan,
) {
  const response = await fetch(`${API_BASE_URL}/generate-recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject,
      performance_report: performanceReport,
      revision_plan: revisionPlan,
    }),
  });

  if (!response.ok) throw new Error("Recommendation generation failed");
  return await response.json();
}
export async function saveStudySession(subject, durationMinutes) {
  const response = await fetch(`${API_BASE_URL}/save-study-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject,
      duration_minutes: durationMinutes
    })
  });

  if (!response.ok) {
    throw new Error("Failed to save study session");
  }

  return await response.json();
}