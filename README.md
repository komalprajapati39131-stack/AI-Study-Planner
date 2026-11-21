# AI Study Planner & Learning Coach 🚀

An AI-powered personalized learning platform that helps students analyze their syllabus, generate adaptive study plans, practice AI-generated quizzes, track performance, and receive intelligent learning recommendations.


## ✨ Features

- **Syllabus Analyzer** – Analyze subjects and topics using AI.
- **AI Study Planner** – Generate personalized study plans.
- **Quiz Generator** – Create topic-based quizzes.
- **Quiz Evaluation** – Evaluate answers and calculate scores.
- **Topic Performance Analysis** – Track strengths and weak areas.
- **AI Learning Coach** – Get personalized learning recommendations.
- **Revision Planner** – Generate revision suggestions.
- **Study Tracker** – Track daily study hours.
- **Progress Dashboard** – Monitor learning progress and statistics.
- **Study Plan & Quiz History** – View previous learning activity.
- **Adaptive Learning** – Adjust recommendations based on performance.


## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Lucide React

**Backend**
- Python
- FastAPI
- LangChain
- Google Gemini API
- Pydantic
- SQLite


```text
AI-Study-Planner/
│
├── backend/
│   ├── app/
│   │   ├── chains/
│   │   ├── database/
│   │   ├── prompts/
│   │   └── schemas/
│   ├── api.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md

```
## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/komalprajapati39131-stack/AI-Study-Planner.git
cd AI-Study-Planner
```

### 2. Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies listed in the project's requirements file.

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```powershell
python -m uvicorn api:app --reload
```

### 3. Frontend Setup
Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## 🔐 Environment Variables
This project uses the Google Gemini API.

Add your API key to `backend/.env`. Never upload your API key or `.env` file to GitHub.

## 🎯 Project Goal

The goal of this project is to make learning more personalized and adaptive by combining AI-powered study planning, performance analysis, and intelligent learning recommendations.

## 👩‍💻 Author

**Komal Prajapati**  
B.Tech – Computer Science & Engineering (AI & Data Science)

GitHub: [komalprajapati39131-stack](https://github.com/komalprajapati39131-stack)
:::