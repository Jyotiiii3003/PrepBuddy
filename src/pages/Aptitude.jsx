import { useState } from "react";
import { useNavigate } from "react-router-dom";

const F = {
  display: "'Clash Display', 'Sora', sans-serif",
  body: "'Sora', 'Segoe UI', sans-serif",
  ui: "'Nunito', 'Sora', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
  primary: "#16A34A", secondary: "#14532D", accent: "#4ADE80",
  bg: "#F0FDF4", bgCard: "#DCFCE7", text: "#052E16",
  textMuted: "#166534", border: "#BBF7D0", borderDark: "#86EFAC", white: "#FFFFFF",
};

const QUESTIONS = [
  { id:1, question:"If 12 men can complete a work in 8 days, how many men are needed to complete it in 4 days?", options:["6","12","24","48"], answer:"24", topic:"Quant", difficulty:"Easy", explanation:"12 × 8 = 96 man-days total. For 4 days: 96 ÷ 4 = 24 men." },
  { id:2, question:"Find the next number in the series: 2, 6, 12, 20, ?", options:["28","30","32","36"], answer:"30", topic:"Logical", difficulty:"Easy", explanation:"Differences are 4, 6, 8, 10 — next difference is 10, giving 20 + 10 = 30." },
  { id:3, question:"Choose the correct synonym of 'Rapid'", options:["Slow","Fast","Weak","Late"], answer:"Fast", topic:"Verbal", difficulty:"Easy", explanation:"Rapid means quick or fast in speed." },
  { id:4, question:"A train 150m long passes a pole in 15 seconds. What is its speed in km/h?", options:["30","36","40","54"], answer:"36", topic:"Quant", difficulty:"Medium", explanation:"Speed = 150 ÷ 15 = 10 m/s. Convert: 10 × 18/5 = 36 km/h." },
  { id:5, question:"If PENCIL is coded as PFODLM, what is PAPER coded as?", options:["QBQFS","QBPFS","QAQFS","RBQFS"], answer:"QBQFS", topic:"Logical", difficulty:"Medium", explanation:"Each letter is shifted by +1 in the alphabet." },
  { id:6, question:"Choose the word closest in meaning to 'Benevolent'", options:["Cruel","Kind","Angry","Selfish"], answer:"Kind", topic:"Verbal", difficulty:"Easy", explanation:"Benevolent means well-meaning and kindly." },
  { id:7, question:"A sum doubles itself in 5 years at simple interest. What is the annual rate?", options:["10%","15%","20%","25%"], answer:"20%", topic:"Quant", difficulty:"Medium", explanation:"SI = P, so P×R×5/100 = P → R = 20%." },
  { id:8, question:"Find the odd one out: 3, 5, 7, 9, 11", options:["3","9","11","5"], answer:"9", topic:"Logical", difficulty:"Easy", explanation:"All others are prime numbers. 9 = 3×3 is composite, not prime." },
];

const DIFF_STYLE = {
  Easy:   { bg:"#DCFCE7", color:"#15803D" },
  Medium: { bg:"#FEF9C3", color:"#854D0E" },
  Hard:   { bg:"#FEE2E2", color:"#991B1B" },
};

const TOPIC_ICONS = { Quant:"🧮", Logical:"🧩", Verbal:"📖", "Data Interpretation":"📊" };

const NAV = [
  { icon:"🏠", label:"Dashboard",    path:"/dashboard" },
  { icon:"💻", label:"DSA Practice", path:"/dsa" },
  { icon:"🧮", label:"Aptitude",     path:"/aptitude", active:true },
  { icon:"📅", label:"Study Planner",path:"/planner" },
  { icon:"👥", label:"Community",    path:"/community" },
];

export default function Aptitude() {
  const navigate = useNavigate();
  const [mode, setMode]                   = useState("browse");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDiff, setSelectedDiff]   = useState("All");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent]             = useState(0);
  const [selected, setSelected]           = useState("");
  const [showAnswer, setShowAnswer]       = useState(false);
  const [answers, setAnswers]             = useState([]);

  const filtered = QUESTIONS.filter(q =>
    (selectedTopic === "All" || q.topic === selectedTopic) &&
    (selectedDiff  === "All" || q.difficulty === selectedDiff)
  );

  const startQuiz = (questions) => {
    setQuizQuestions(questions);
    setCurrent(0); setSelected(""); setShowAnswer(false); setAnswers([]);
    setMode("quiz");
  };

  const handleSubmit = () => {
    setShowAnswer(true);
    setAnswers(prev => [...prev, {
      question: quizQuestions[current],
      selected,
      correct: selected === quizQuestions[current].answer,
    }]);
  };

  const handleNext = () => {
    if (current + 1 >= quizQuestions.length) setMode("result");
    else { setCurrent(c => c+1); setSelected(""); setShowAnswer(false); }
  };

  const score = answers.filter(a => a.correct).length;
  const q     = quizQuestions[current];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:F.body }}>

      {/* SIDEBAR */}
      <aside style={{ width:220, background:C.secondary, display:"flex", flexDirection:"column", padding:"20px 0", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div onClick={() => navigate("/")} style={{ padding:"0 16px 24px", display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
          <div style={{ width:30, height:30, background:C.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚡</div>
          <span style={{ fontFamily:F.display, fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>
            Prep<span style={{ color:C.accent }}>Buddy</span>
          </span>
        </div>
        {NAV.map(item => (
          <div key={item.label} onClick={() => navigate(item.path)}
            style={{ display:"flex", alignItems:"center", gap:13, padding:"12px 20px", margin:"2px 8px", borderRadius:11, cursor:"pointer", background:item.active?"rgba(74,222,128,0.15)":"transparent", borderLeft:item.active?`3px solid ${C.accent}`:"3px solid transparent" }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background="rgba(255,255,255,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background="transparent")}
          >
            <span style={{ fontSize:19 }}>{item.icon}</span>
            <span style={{ fontFamily:F.ui, fontSize:15, fontWeight:item.active?700:500, color:item.active?C.accent:"#86EFAC" }}>{item.label}</span>
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, padding:"30px 36px", overflowY:"auto" }}>

        {/* BROWSE MODE */}
        {mode === "browse" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:14 }}>
              <div>
                <h1 style={{ fontFamily:F.display, fontSize:"clamp(1.7rem, 2.5vw, 2.3rem)", fontWeight:700, color:C.secondary, marginBottom:6, letterSpacing:"-0.02em" }}>
                  Aptitude Practice 🧮
                </h1>
                <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted }}>Master Quant, Logical and Verbal for placements</p>
              </div>
              <button onClick={() => startQuiz(filtered.slice(0,5))}
                style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"12px 26px", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
                ▶ Start Mock Test
              </button>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:14, marginBottom:26 }}>
              {[
                { label:"Total Questions", value:QUESTIONS.length,                              icon:"📝", color:C.primary  },
                { label:"Quant",           value:QUESTIONS.filter(q=>q.topic==="Quant").length,   icon:"🧮", color:"#2563EB" },
                { label:"Logical",         value:QUESTIONS.filter(q=>q.topic==="Logical").length, icon:"🧩", color:"#7C3AED" },
                { label:"Verbal",          value:QUESTIONS.filter(q=>q.topic==="Verbal").length,  icon:"📖", color:"#EA580C" },
              ].map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 22px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:600 }}>{s.label}</span>
                    <span style={{ fontSize:20 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily:F.mono, fontSize:32, fontWeight:600, color:s.color, letterSpacing:"-0.02em" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Topic Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:28 }}>
              {["Quant","Logical","Verbal","Data Interpretation"].map(topic => (
                <div key={topic} onClick={() => startQuiz(QUESTIONS.filter(q=>q.topic===topic))}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderDark; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 28px ${C.primary}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                  style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:"22px", cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ fontSize:30, marginBottom:12 }}>{TOPIC_ICONS[topic]}</div>
                  <div style={{ fontFamily:F.body, fontSize:17, fontWeight:700, color:C.secondary, marginBottom:5 }}>{topic}</div>
                  <div style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:500, marginBottom:16 }}>
                    {QUESTIONS.filter(q=>q.topic===topic).length} questions
                  </div>
                  <div style={{ fontFamily:F.ui, fontSize:14, color:C.primary, fontWeight:700 }}>Practice now →</div>
                </div>
              ))}
            </div>

            {/* Question List */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
              <div style={{ padding:"16px 22px", background:C.bgCard, borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontFamily:F.body, fontSize:16, fontWeight:700, color:C.secondary }}>All Questions</span>
                <div style={{ display:"flex", gap:8, marginLeft:"auto", flexWrap:"wrap" }}>
                  {["All","Quant","Logical","Verbal"].map(t => (
                    <button key={t} onClick={() => setSelectedTopic(t)}
                      style={{ fontFamily:F.ui, padding:"6px 16px", borderRadius:100, border:`1.5px solid ${selectedTopic===t?C.primary:C.border}`, background:selectedTopic===t?C.primary:C.white, color:selectedTopic===t?"#fff":C.textMuted, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      {t}
                    </button>
                  ))}
                  {["All","Easy","Medium"].map(d => (
                    <button key={d} onClick={() => setSelectedDiff(d)}
                      style={{ fontFamily:F.ui, padding:"6px 16px", borderRadius:100, border:`1.5px solid ${selectedDiff===d?C.primary:C.border}`, background:selectedDiff===d?C.bgCard:C.white, color:selectedDiff===d?C.primary:C.textMuted, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.map((q, i) => (
                <div key={q.id} onClick={() => startQuiz([q])}
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 22px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", cursor:"pointer", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background=C.bg}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <span style={{ fontSize:20 }}>{TOPIC_ICONS[q.topic]}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:F.body, fontSize:15, fontWeight:600, color:C.secondary, marginBottom:3 }}>
                      {q.question.length>72 ? q.question.slice(0,72)+"..." : q.question}
                    </div>
                    <div style={{ fontFamily:F.ui, fontSize:13, color:C.textMuted, fontWeight:500 }}>{q.topic}</div>
                  </div>
                  <span style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:20, background:DIFF_STYLE[q.difficulty].bg, color:DIFF_STYLE[q.difficulty].color }}>
                    {q.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* QUIZ MODE */}
        {mode === "quiz" && q && (
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <button onClick={() => setMode("browse")}
                style={{ fontFamily:F.ui, background:C.bgCard, border:"none", color:C.secondary, padding:"8px 18px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                ← Exit Quiz
              </button>
              <span style={{ fontFamily:F.ui, fontSize:15, color:C.textMuted, fontWeight:700 }}>
                Question <span style={{ fontFamily:F.mono }}>{current+1}</span> of <span style={{ fontFamily:F.mono }}>{quizQuestions.length}</span>
              </span>
            </div>

            <div style={{ height:7, background:C.bgCard, borderRadius:100, marginBottom:30, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${((current+1)/quizQuestions.length)*100}%`, background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius:100, transition:"width 0.3s" }} />
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:22, padding:"30px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                <span style={{ fontFamily:F.ui, fontSize:13, fontWeight:700, padding:"4px 12px", borderRadius:20, background:C.bgCard, color:C.primary }}>{q.topic}</span>
                <span style={{ fontFamily:F.ui, fontSize:13, fontWeight:700, padding:"4px 12px", borderRadius:20, background:DIFF_STYLE[q.difficulty].bg, color:DIFF_STYLE[q.difficulty].color }}>{q.difficulty}</span>
              </div>

              <h2 style={{ fontFamily:F.body, fontSize:"clamp(1.1rem, 2vw, 1.35rem)", fontWeight:700, color:C.secondary, lineHeight:1.65, marginBottom:26 }}>
                {q.question}
              </h2>

              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:26 }}>
                {q.options.map(opt => {
                  let bg=C.white, border=C.border, color=C.text;
                  if (showAnswer) {
                    if (opt===q.answer) { bg="#DCFCE7"; border=C.primary; color=C.primary; }
                    else if (opt===selected&&opt!==q.answer) { bg="#FEE2E2"; border="#DC2626"; color="#DC2626"; }
                  } else if (selected===opt) { bg=C.bgCard; border=C.primary; color=C.secondary; }
                  return (
                    <div key={opt} onClick={() => !showAnswer && setSelected(opt)}
                      style={{ padding:"14px 20px", borderRadius:13, border:`1.5px solid ${border}`, background:bg, color, fontFamily:F.body, fontSize:16, fontWeight:selected===opt||(showAnswer&&opt===q.answer)?700:400, cursor:showAnswer?"default":"pointer", transition:"all 0.15s" }}>
                      {opt}
                    </div>
                  );
                })}
              </div>

              {showAnswer && (
                <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:13, padding:"16px 20px", marginBottom:22 }}>
                  <div style={{ fontFamily:F.ui, fontSize:13, fontWeight:800, color:C.primary, marginBottom:8, letterSpacing:"0.06em" }}>💡 EXPLANATION</div>
                  <p style={{ fontFamily:F.body, fontSize:15, color:C.text, lineHeight:1.75, margin:0 }}>{q.explanation}</p>
                </div>
              )}

              {!showAnswer ? (
                <button onClick={handleSubmit} disabled={!selected}
                  style={{ width:"100%", padding:"14px", borderRadius:13, background:selected?C.primary:C.border, border:"none", color:selected?"#fff":C.textMuted, fontFamily:F.ui, fontSize:17, fontWeight:800, cursor:selected?"pointer":"not-allowed" }}>
                  Submit Answer
                </button>
              ) : (
                <button onClick={handleNext}
                  style={{ width:"100%", padding:"14px", borderRadius:13, background:C.primary, border:"none", color:"#fff", fontFamily:F.ui, fontSize:17, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
                  {current+1>=quizQuestions.length ? "See Results →" : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {mode === "result" && (
          <div style={{ maxWidth:580, margin:"0 auto", textAlign:"center" }}>
            <div style={{ fontSize:68, marginBottom:20 }}>
              {score===quizQuestions.length?"🎉":score>=quizQuestions.length/2?"👍":"💪"}
            </div>
            <h2 style={{ fontFamily:F.display, fontSize:"clamp(1.8rem, 3vw, 2.6rem)", fontWeight:700, color:C.secondary, marginBottom:10, letterSpacing:"-0.025em" }}>
              {score===quizQuestions.length?"Perfect Score!":score>=quizQuestions.length/2?"Good Job!":"Keep Practicing!"}
            </h2>
            <p style={{ fontFamily:F.body, fontSize:18, color:C.textMuted, marginBottom:36 }}>
              You scored{" "}
              <strong style={{ fontFamily:F.mono, color:C.primary, fontSize:22 }}>{score}/{quizQuestions.length}</strong>
            </p>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:22, padding:"24px", marginBottom:26, textAlign:"left" }}>
              <h3 style={{ fontFamily:F.body, fontSize:18, fontWeight:700, color:C.secondary, marginBottom:18 }}>Review</h3>
              {answers.map((a, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14, paddingBottom:14, borderBottom:i<answers.length-1?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{a.correct?"✅":"❌"}</span>
                  <div>
                    <div style={{ fontFamily:F.body, fontSize:14, fontWeight:600, color:C.secondary, marginBottom:3 }}>
                      {a.question.question.slice(0,65)}...
                    </div>
                    {!a.correct && (
                      <div style={{ fontFamily:F.ui, fontSize:13, color:"#DC2626", fontWeight:600 }}>Correct: {a.question.answer}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button onClick={() => startQuiz(quizQuestions)}
                style={{ flex:1, padding:"14px", borderRadius:13, background:C.primary, border:"none", color:"#fff", fontFamily:F.ui, fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
                Retry Quiz
              </button>
              <button onClick={() => setMode("browse")}
                style={{ flex:1, padding:"14px", borderRadius:13, background:"transparent", border:`1.5px solid ${C.border}`, color:C.secondary, fontFamily:F.ui, fontSize:16, fontWeight:700, cursor:"pointer" }}>
                Browse More
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
