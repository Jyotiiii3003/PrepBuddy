import { useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#16A34A",
  secondary: "#14532D",
  accent: "#4ADE80",
  bg: "#F0FDF4",
  bgCard: "#DCFCE7",
  text: "#052E16",
  textMuted: "#166534",
  border: "#BBF7D0",
  borderDark: "#86EFAC",
  white: "#FFFFFF",
};

const TOPICS = ["All", "Quant", "Logical", "Verbal", "Data Interpretation"];

const QUESTIONS = [
  { id: 1, question: "If 12 men complete a work in 8 days, how many men are needed to complete it in 4 days?", options: ["6", "12", "24", "48"], answer: "24", topic: "Quant", difficulty: "Easy", explanation: "12 × 8 = 96 man-days total. For 4 days: 96 ÷ 4 = 24 men." },
  { id: 2, question: "Find the next number: 2, 6, 12, 20, ?", options: ["28", "30", "32", "36"], answer: "30", topic: "Logical", difficulty: "Easy", explanation: "Differences are 4, 6, 8, 10 — so next difference is 10, giving 20+10=30." },
  { id: 3, question: "Choose the correct synonym of 'Rapid'", options: ["Slow", "Fast", "Weak", "Late"], answer: "Fast", topic: "Verbal", difficulty: "Easy", explanation: "Rapid means quick or fast." },
  { id: 4, question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?", options: ["30", "36", "40", "54"], answer: "36", topic: "Quant", difficulty: "Medium", explanation: "Speed = 150/15 = 10 m/s. Convert: 10 × 18/5 = 36 km/h." },
  { id: 5, question: "If PENCIL is coded as PFODLM, what is PAPER coded as?", options: ["QBQFS", "QBPFS", "QAQFS", "RBQFS"], answer: "QBQFS", topic: "Logical", difficulty: "Medium", explanation: "Each letter is shifted by +1 in the alphabet." },
  { id: 6, question: "Choose the word closest in meaning to 'Benevolent'", options: ["Cruel", "Kind", "Angry", "Selfish"], answer: "Kind", topic: "Verbal", difficulty: "Easy", explanation: "Benevolent means well-meaning and kindly." },
  { id: 7, question: "A sum doubles itself in 5 years at simple interest. What is the rate?", options: ["10%", "15%", "20%", "25%"], answer: "20%", topic: "Quant", difficulty: "Medium", explanation: "SI = P, so P×R×5/100 = P → R = 20%." },
  { id: 8, question: "Find the odd one out: 3, 5, 7, 9, 11", options: ["3", "9", "11", "5"], answer: "9", topic: "Logical", difficulty: "Easy", explanation: "All others are prime numbers. 9 = 3×3 is not prime." },
];

const DIFF_STYLE = {
  Easy: { bg: "#DCFCE7", color: "#15803D" },
  Medium: { bg: "#FEF9C3", color: "#854D0E" },
  Hard: { bg: "#FEE2E2", color: "#991B1B" },
};

const TOPIC_ICONS = {
  Quant: "🧮",
  Logical: "🧩",
  Verbal: "📖",
  "Data Interpretation": "📊",
};

export default function Aptitude() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("browse"); // browse | quiz | result
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDiff, setSelectedDiff] = useState("All");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timerOn, setTimerOn] = useState(false);

  const filtered = QUESTIONS.filter(q =>
    (selectedTopic === "All" || q.topic === selectedTopic) &&
    (selectedDiff === "All" || q.difficulty === selectedDiff)
  );

  const startQuiz = (questions) => {
    setQuizQuestions(questions);
    setCurrent(0);
    setSelected("");
    setShowAnswer(false);
    setAnswers([]);
    setMode("quiz");
  };

  const handleSubmit = () => {
    setShowAnswer(true);
    setAnswers(prev => [...prev, { question: quizQuestions[current], selected, correct: selected === quizQuestions[current].answer }]);
  };

  const handleNext = () => {
    if (current + 1 >= quizQuestions.length) {
      setMode("result");
    } else {
      setCurrent(c => c + 1);
      setSelected("");
      setShowAnswer(false);
    }
  };

  const score = answers.filter(a => a.correct).length;
  const q = quizQuestions[current];

  const NAV = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "💻", label: "DSA Practice", path: "/dsa" },
    { icon: "🧮", label: "Aptitude", path: "/aptitude", active: true },
    { icon: "📅", label: "Study Planner", path: "/planner" },
    { icon: "👥", label: "Community", path: "/community" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: COLORS.secondary, display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div onClick={() => navigate("/")} style={{ padding: "0 16px 24px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Prep<span style={{ color: COLORS.accent }}>Buddy</span></span>
        </div>
        {NAV.map(item => (
          <div key={item.label} onClick={() => navigate(item.path)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", margin: "2px 8px", borderRadius: 10, cursor: "pointer", background: item.active ? "rgba(74,222,128,0.15)" : "transparent", borderLeft: item.active ? `3px solid ${COLORS.accent}` : "3px solid transparent" }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 14, fontWeight: item.active ? 600 : 400, color: item.active ? COLORS.accent : "#86EFAC" }}>{item.label}</span>
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* BROWSE MODE */}
        {mode === "browse" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.secondary, marginBottom: 4 }}>Aptitude Practice 🧮</h1>
                <p style={{ fontSize: 14, color: COLORS.textMuted }}>Master Quant, Logical and Verbal for placements</p>
              </div>
              <button
                onClick={() => startQuiz(filtered.slice(0, 5))}
                style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "11px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${COLORS.primary}44` }}>
                ▶ Start Mock Test
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Questions", value: QUESTIONS.length, icon: "📝", color: COLORS.primary },
                { label: "Quant", value: QUESTIONS.filter(q => q.topic === "Quant").length, icon: "🧮", color: "#2563EB" },
                { label: "Logical", value: QUESTIONS.filter(q => q.topic === "Logical").length, icon: "🧩", color: "#7C3AED" },
                { label: "Verbal", value: QUESTIONS.filter(q => q.topic === "Verbal").length, icon: "📖", color: "#EA580C" },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Topic Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              {["Quant", "Logical", "Verbal", "Data Interpretation"].map(topic => (
                <div key={topic}
                  onClick={() => { setSelectedTopic(topic); startQuiz(QUESTIONS.filter(q => q.topic === topic)); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderDark; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
                  style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{TOPIC_ICONS[topic]}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 4 }}>{topic}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>{QUESTIONS.filter(q => q.topic === topic).length} questions</div>
                  <div style={{ marginTop: 14, fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>Practice now →</div>
                </div>
              ))}
            </div>

            {/* Filters + Question List */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.secondary }}>All Questions</span>
                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                  {TOPICS.map(t => (
                    <button key={t} onClick={() => setSelectedTopic(t)}
                      style={{ padding: "5px 14px", borderRadius: 100, border: `1.5px solid ${selectedTopic === t ? COLORS.primary : COLORS.border}`, background: selectedTopic === t ? COLORS.primary : COLORS.white, color: selectedTopic === t ? "#fff" : COLORS.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.map((q, i) => (
                <div key={q.id}
                  onClick={() => startQuiz([q])}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 18 }}>{TOPIC_ICONS[q.topic]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 2 }}>{q.question.length > 70 ? q.question.slice(0, 70) + "..." : q.question}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{q.topic}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: DIFF_STYLE[q.difficulty].bg, color: DIFF_STYLE[q.difficulty].color }}>{q.difficulty}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* QUIZ MODE */}
        {mode === "quiz" && q && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {/* Progress bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setMode("browse")} style={{ background: COLORS.bgCard, border: "none", color: COLORS.secondary, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Exit Quiz</button>
              <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600 }}>Question {current + 1} of {quizQuestions.length}</span>
            </div>
            <div style={{ height: 6, background: COLORS.bgCard, borderRadius: 100, marginBottom: 28, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((current + 1) / quizQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 100, transition: "width 0.3s" }} />
            </div>

            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "28px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: COLORS.bgCard, color: COLORS.primary }}>{q.topic}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: DIFF_STYLE[q.difficulty].bg, color: DIFF_STYLE[q.difficulty].color }}>{q.difficulty}</span>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.secondary, lineHeight: 1.6, marginBottom: 24 }}>{q.question}</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {q.options.map(opt => {
                  let bg = COLORS.white;
                  let border = COLORS.border;
                  let color = COLORS.text;
                  if (showAnswer) {
                    if (opt === q.answer) { bg = "#DCFCE7"; border = COLORS.primary; color = COLORS.primary; }
                    else if (opt === selected && opt !== q.answer) { bg = "#FEE2E2"; border = "#DC2626"; color = "#DC2626"; }
                  } else if (selected === opt) {
                    bg = COLORS.bgCard; border = COLORS.primary; color = COLORS.secondary;
                  }
                  return (
                    <div key={opt} onClick={() => !showAnswer && setSelected(opt)}
                      style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontSize: 14, fontWeight: selected === opt || (showAnswer && opt === q.answer) ? 600 : 400, cursor: showAnswer ? "default" : "pointer", transition: "all 0.15s" }}>
                      {opt}
                    </div>
                  );
                })}
              </div>

              {showAnswer && (
                <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}>💡 EXPLANATION</div>
                  <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
                </div>
              )}

              {!showAnswer ? (
                <button onClick={handleSubmit} disabled={!selected}
                  style={{ width: "100%", padding: "13px", borderRadius: 12, background: selected ? COLORS.primary : COLORS.border, border: "none", color: selected ? "#fff" : COLORS.textMuted, fontSize: 15, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed" }}>
                  Submit Answer
                </button>
              ) : (
                <button onClick={handleNext}
                  style={{ width: "100%", padding: "13px", borderRadius: 12, background: COLORS.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  {current + 1 >= quizQuestions.length ? "See Results →" : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {mode === "result" && (
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {score === quizQuestions.length ? "🎉" : score >= quizQuestions.length / 2 ? "👍" : "💪"}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: COLORS.secondary, marginBottom: 8 }}>
              {score === quizQuestions.length ? "Perfect Score!" : score >= quizQuestions.length / 2 ? "Good Job!" : "Keep Practicing!"}
            </h2>
            <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
              You scored <strong style={{ color: COLORS.primary }}>{score} out of {quizQuestions.length}</strong>
            </p>

            {/* Answer review */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px", marginBottom: 24, textAlign: "left" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 16 }}>Review</h3>
              {answers.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < answers.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{a.correct ? "✅" : "❌"}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary }}>{a.question.question.slice(0, 60)}...</div>
                    {!a.correct && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 2 }}>Correct: {a.question.answer}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => startQuiz(quizQuestions)}
                style={{ flex: 1, padding: "13px", borderRadius: 12, background: COLORS.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Retry Quiz
              </button>
              <button onClick={() => setMode("browse")}
                style={{ flex: 1, padding: "13px", borderRadius: 12, background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.secondary, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Browse More
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
