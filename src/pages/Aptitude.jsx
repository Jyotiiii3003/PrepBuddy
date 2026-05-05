import { useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#16A34A",
  secondary: "#14532D",
  bg: "#F0FDF4",
  text: "#052E16",
  textMuted: "#166534",
  border: "#BBF7D0",
  white: "#FFFFFF",
};

const QUESTIONS = [
  {
    question: "If 12 men can complete a work in 8 days, how many men are needed to complete it in 4 days?",
    options: ["6", "12", "24", "48"],
    answer: "24",
    topic: "Quant",
  },
  {
    question: "Find the next number: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    answer: "30",
    topic: "Logical",
  },
  {
    question: "Choose the correct synonym of 'Rapid'",
    options: ["Slow", "Fast", "Weak", "Late"],
    answer: "Fast",
    topic: "Verbal",
  },
];

export default function Aptitude() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const q = QUESTIONS[current];

  const handleSubmit = () => {
    setShowAnswer(true);
    if (selected === q.answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    setSelected("");
    setShowAnswer(false);
    setCurrent(current + 1);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: COLORS.secondary,
        padding: "20px 0",
        transition: "0.3s"
      }}>
        <div style={{ padding: "0 16px 20px", display: "flex", justifyContent: "space-between" }}>
          {sidebarOpen && <span style={{ color: "#fff", fontWeight: 700 }}>PrepBuddy</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>◀</button>
        </div>

        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "DSA Practice", path: "/dsa" },
          { label: "Aptitude", path: "/aptitude" },
          { label: "Planner", path: "/planner" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              color: "#86EFAC",
            }}
          >
            {sidebarOpen && item.label}
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "32px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, color: COLORS.text }}>
            Aptitude Practice
          </h1>
          <p style={{ color: COLORS.textMuted }}>
            Solve questions and improve accuracy
          </p>
        </div>

        {/* SCORE */}
        <div style={{
          background: COLORS.white,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          marginBottom: 24
        }}>
          <strong>Score:</strong> {score} / {QUESTIONS.length}
        </div>

        {/* QUESTION CARD */}
        <div style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 24,
          maxWidth: 700
        }}>
          <div style={{ marginBottom: 16, fontWeight: 600 }}>
            {q.topic}
          </div>

          <h2 style={{
            
            marginBottom: 20,
            lineHeight: 1.6
          }}>
            {q.question}
          </h2>

          {/* OPTIONS */}
          {q.options.map((opt) => (
            <div
              key={opt}
              onClick={() => !showAnswer && setSelected(opt)}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                marginBottom: 10,
                cursor: "pointer",
                background:
                  selected === opt ? COLORS.bg : COLORS.white,
              }}
            >
              {opt}
            </div>
          ))}

          {/* ACTION BUTTON */}
          {!showAnswer ? (
            <button
              onClick={handleSubmit}
              style={{
                marginTop: 16,
                padding: "12px 18px",
                background: COLORS.primary,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Submit
            </button>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontWeight: 600,
                color:
                  selected === q.answer ? "#15803D" : "#DC2626"
              }}>
                {selected === q.answer
                  ? "Correct answer"
                  : `Wrong answer. Correct: ${q.answer}`}
              </div>

              {current < QUESTIONS.length - 1 && (
                <button
                  onClick={nextQuestion}
                  style={{
                    marginTop: 12,
                    padding: "10px 16px",
                    background: COLORS.secondary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}