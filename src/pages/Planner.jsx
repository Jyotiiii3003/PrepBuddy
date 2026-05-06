import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { generateStudyPlan } from "../utils/gemini";

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

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture",
  "Flipkart", "Swiggy", "Zomato", "Paytm", "CRED", "Other",
];

const WEAK_TOPICS = [
  "Arrays", "Strings", "Linked List", "Trees", "Graphs",
  "DP", "Recursion", "Sorting", "Binary Search", "Stacks",
  "Queues", "Quant", "Verbal", "Logical Reasoning",
];

const WEEKLY_PROGRESS = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 6 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 7 },
  { day: "Sun", value: 5 },
];

const FALLBACK_PLAN = [
  { day: "Day 1", topic: "Arrays — Two Pointer", problems: 3, aptitude: "Number Series", type: "dsa" },
  { day: "Day 2", topic: "Arrays — Sliding Window", problems: 3, aptitude: "Percentage", type: "dsa" },
  { day: "Day 3", topic: "Strings — Basics", problems: 3, aptitude: "Ratio & Proportion", type: "dsa" },
  { day: "Day 4", topic: "Revision — Arrays + Strings", problems: 2, aptitude: "Speed & Distance", type: "revision" },
  { day: "Day 5", topic: "Linked List — Basics", problems: 3, aptitude: "Time & Work", type: "dsa" },
  { day: "Day 6", topic: "Linked List — Advanced", problems: 3, aptitude: "Profit & Loss", type: "dsa" },
  { day: "Day 7", topic: "Mock Test — Week 1", problems: 10, aptitude: "Full Mock", type: "mock" },
];

const TYPE_STYLE = {
  dsa: { bg: COLORS.bgCard, color: COLORS.primary, label: "DSA" },
  aptitude: { bg: "#FEF9C3", color: "#854D0E", label: "Aptitude" },
  revision: { bg: "#EDE9FE", color: "#6D28D9", label: "Revision" },
  mock: { bg: "#FEE2E2", color: "#991B1B", label: "Mock Test" },
};

const INITIAL_TASKS = [
  { day: "Monday", tasks: [
    { time: "9:00 AM", task: "Arrays — Sliding Window", type: "DSA", done: true },
    { time: "11:00 AM", task: "Aptitude — Time & Work", type: "APT", done: false },
    { time: "3:00 PM", task: "Mock Test", type: "MOCK", done: false },
  ]},
  { day: "Tuesday", tasks: [
    { time: "10:00 AM", task: "Trees — Traversal", type: "DSA", done: false },
    { time: "2:00 PM", task: "Number Series", type: "APT", done: false },
  ]},
  { day: "Wednesday", tasks: [
    { time: "10:00 AM", task: "Graphs — BFS/DFS", type: "DSA", done: false },
    { time: "2:00 PM", task: "Profit & Loss", type: "APT", done: false },
    { time: "4:00 PM", task: "Revision — Arrays", type: "REV", done: false },
  ]},
];

const TASK_TYPE_STYLE = {
  DSA: { bg: COLORS.bgCard, color: COLORS.primary },
  APT: { bg: "#FEF9C3", color: "#854D0E" },
  MOCK: { bg: "#FEE2E2", color: "#991B1B" },
  REV: { bg: "#EDE9FE", color: "#6D28D9" },
};

export default function Planner() {
  const navigate = useNavigate();
  const [view, setView] = useState("weekly"); // weekly | aiplan
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [completedDays, setCompletedDays] = useState({});
  const [activeWeek, setActiveWeek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ company: "", examDate: "", dailyHours: "2", weakTopics: [] });
  const [showForm, setShowForm] = useState(false);

  const toggleTask = (dayIndex, taskIndex) => {
    const updated = [...tasks];
    updated[dayIndex].tasks[taskIndex].done = !updated[dayIndex].tasks[taskIndex].done;
    setTasks(updated);
  };

  const toggleWeakTopic = (topic) => {
    setForm(f => ({
      ...f,
      weakTopics: f.weakTopics.includes(topic)
        ? f.weakTopics.filter(t => t !== topic)
        : [...f.weakTopics, topic],
    }));
  };

  const toggleDay = (index) => {
    setCompletedDays(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const totalTasks = tasks.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = tasks.reduce((acc, d) => acc + d.tasks.filter(t => t.done).length, 0);
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const handleGenerate = async () => {
    if (!form.company) { setError("Please select your target company."); return; }
    if (!form.examDate) { setError("Please select your exam date."); return; }
    if (form.weakTopics.length === 0) { setError("Please select at least one weak topic."); return; }
    setLoading(true);
    setError("");
    try {
      const result = await generateStudyPlan(form.company, form.examDate, form.dailyHours, form.weakTopics);
      setPlan(result);
    } catch {
      setPlan(FALLBACK_PLAN);
    }
    setLoading(false);
    setShowForm(false);
    setView("aiplan");
  };

  const weeks = plan ? Array.from({ length: Math.ceil(plan.length / 7) }, (_, i) => plan.slice(i * 7, i * 7 + 7)) : [];
  const completedCount = Object.values(completedDays).filter(Boolean).length;

  const NAV = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "💻", label: "DSA Practice", path: "/dsa" },
    { icon: "🧮", label: "Aptitude", path: "/aptitude" },
    { icon: "📅", label: "Study Planner", path: "/planner", active: true },
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

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.secondary, marginBottom: 4 }}>📅 Study Planner</h1>
            <p style={{ fontSize: 14, color: COLORS.textMuted }}>Your AI-powered personalized roadmap</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowForm(!showForm)}
              style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${COLORS.primary}44` }}>
              ✨ Generate AI Plan
            </button>
          </div>
        </div>

        {/* VIEW TOGGLE */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.white, borderRadius: 12, padding: 4, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
          {[
            { key: "weekly", label: "Weekly Tasks", icon: "📋" },
            { key: "aiplan", label: "AI Plan", icon: "🤖" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)}
              style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: view === tab.key ? COLORS.primary : "transparent", color: view === tab.key ? "#fff" : COLORS.textMuted, fontSize: 14, fontWeight: view === tab.key ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* AI PLAN FORM */}
        {showForm && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.secondary, marginBottom: 20 }}>✨ Generate Your AI Study Plan</h3>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>⚠️ {error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Target Company</label>
                <select value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.bg, fontSize: 14, color: COLORS.text, outline: "none", cursor: "pointer" }}>
                  <option value="">Select company...</option>
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Exam / Interview Date</label>
                <input type="date" value={form.examDate} onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.bg, fontSize: 14, color: COLORS.text, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Daily Study Hours</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["1", "2", "3", "4", "5+"].map(h => (
                  <button key={h} onClick={() => setForm(f => ({ ...f, dailyHours: h }))}
                    style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: `1.5px solid ${form.dailyHours === h ? COLORS.primary : COLORS.border}`, background: form.dailyHours === h ? COLORS.primary : COLORS.white, color: form.dailyHours === h ? "#fff" : COLORS.textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Weak Topics <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>(select all that apply)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {WEAK_TOPICS.map(t => (
                  <button key={t} onClick={() => toggleWeakTopic(t)}
                    style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${form.weakTopics.includes(t) ? COLORS.primary : COLORS.border}`, background: form.weakTopics.includes(t) ? COLORS.bgCard : COLORS.white, color: form.weakTopics.includes(t) ? COLORS.primary : COLORS.textMuted, fontSize: 12, fontWeight: form.weakTopics.includes(t) ? 600 : 400, cursor: "pointer" }}>
                    {form.weakTopics.includes(t) ? "✓ " : ""}{t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleGenerate} disabled={loading}
                style={{ flex: 1, padding: "13px", borderRadius: 12, background: loading ? COLORS.borderDark : COLORS.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "🧠 Generating your plan..." : "✨ Generate Plan"}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding: "13px 20px", borderRadius: 12, background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.secondary, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* WEEKLY VIEW */}
        {view === "weekly" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Progress", value: `${progress}%`, icon: "📊", color: COLORS.primary },
                { label: "Completed", value: `${completedTasks} tasks`, icon: "✅", color: "#2563EB" },
                { label: "Remaining", value: `${totalTasks - completedTasks} tasks`, icon: "⏳", color: "#EA580C" },
                { label: "Today's Tasks", value: tasks[0]?.tasks.length || 0, icon: "📅", color: "#7C3AED" },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "18px 24px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary }}>Weekly Progress</span>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{progress}% complete</span>
              </div>
              <div style={{ height: 10, background: COLORS.bgCard, borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 100, transition: "width 0.5s" }} />
              </div>
            </div>

            {/* Activity Chart */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px 24px", marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 4 }}>Weekly Activity</h3>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 16 }}>Problems solved per day</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={WEEKLY_PROGRESS}>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13 }} />
                  <Area type="monotone" dataKey="value" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: COLORS.primary, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Task List */}
            {tasks.map((day, dIndex) => (
              <div key={day.day} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, margin: 0 }}>{day.day}</h3>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {day.tasks.filter(t => t.done).length}/{day.tasks.length} done
                  </span>
                </div>
                {day.tasks.map((task, tIndex) => (
                  <div key={tIndex} onClick={() => toggleTask(dIndex, tIndex)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer", background: task.done ? COLORS.bgCard : COLORS.bg, opacity: task.done ? 0.7 : 1, transition: "all 0.2s" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${task.done ? COLORS.primary : COLORS.border}`, background: task.done ? COLORS.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0, transition: "all 0.2s" }}>
                      {task.done ? "✓" : ""}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary, textDecoration: task.done ? "line-through" : "none" }}>{task.task}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{task.time}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: TASK_TYPE_STYLE[task.type]?.bg || COLORS.bgCard, color: TASK_TYPE_STYLE[task.type]?.color || COLORS.primary }}>
                      {task.type}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* AI PLAN VIEW */}
        {view === "aiplan" && (
          <>
            {!plan ? (
              <div style={{ background: COLORS.white, border: `2px dashed ${COLORS.border}`, borderRadius: 20, padding: "60px 40px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.secondary, marginBottom: 10 }}>No AI Plan Yet</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>Click the Generate AI Plan button above to create your personalized study roadmap.</p>
                <button onClick={() => setShowForm(true)}
                  style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  ✨ Generate My Plan
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, color: COLORS.textMuted }}>
                      Targeting <strong>{form.company}</strong> · {form.dailyHours} hrs/day · {plan.length} days
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {weeks.length > 1 && weeks.map((_, i) => (
                      <button key={i} onClick={() => setActiveWeek(i)}
                        style={{ padding: "7px 18px", borderRadius: 100, border: `1.5px solid ${activeWeek === i ? COLORS.primary : COLORS.border}`, background: activeWeek === i ? COLORS.primary : COLORS.white, color: activeWeek === i ? "#fff" : COLORS.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Week {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setShowForm(true)}
                      style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.secondary, padding: "7px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      ✏️ Regenerate
                    </button>
                  </div>
                </div>

                {/* Plan completion */}
                <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "18px 24px", marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary }}>Plan Completion</span>
                    <span style={{ fontSize: 13, color: COLORS.textMuted }}>{completedCount}/{plan.length} days</span>
                  </div>
                  <div style={{ height: 10, background: COLORS.bgCard, borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: plan.length ? `${(completedCount / plan.length) * 100}%` : "0%", background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 100, transition: "width 0.4s" }} />
                  </div>
                </div>

                {/* Day cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {(weeks[activeWeek] || plan).map((day, i) => {
                    const globalIndex = activeWeek * 7 + i;
                    const done = completedDays[globalIndex];
                    const ts = TYPE_STYLE[day.type] || TYPE_STYLE.dsa;
                    return (
                      <div key={i} style={{ background: done ? COLORS.bgCard : COLORS.white, border: `1.5px solid ${done ? COLORS.borderDark : COLORS.border}`, borderRadius: 18, padding: "20px", transition: "all 0.2s" }}
                        onMouseEnter={e => !done && (e.currentTarget.style.transform = "translateY(-3px)")}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{day.day}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: done ? COLORS.textMuted : COLORS.secondary, textDecoration: done ? "line-through" : "none" }}>{day.topic}</div>
                          </div>
                          <button onClick={() => toggleDay(globalIndex)}
                            style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${done ? COLORS.primary : COLORS.border}`, background: done ? COLORS.primary : "transparent", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                            {done ? "✓" : ""}
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: COLORS.textMuted }}>Problems</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary }}>{day.problems}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: COLORS.textMuted }}>Aptitude</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#854D0E" }}>{day.aptitude}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: ts.bg, color: ts.color }}>{ts.label}</span>
                          {!done && (
                            <button onClick={() => navigate("/dsa")} style={{ fontSize: 12, color: COLORS.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Start →</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* AI Banner */}
        <div style={{ marginTop: 28, background: COLORS.secondary, borderRadius: 18, padding: "20px 28px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 44, height: 44, background: "rgba(74,222,128,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>AI Tip</div>
            <div style={{ fontSize: 13, color: "#86EFAC" }}>Consistency beats intensity. Two focused hours daily beats eight hours on weekends. Mark each day done to build your streak!</div>
          </div>
        </div>

      </main>
    </div>
  );
}
