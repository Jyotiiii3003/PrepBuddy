import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, AreaChart, Area
} from "recharts";
import { F } from "../utils/theme";
const COLORS = {
  primary: "#16A34A",
  secondary: "#14532D",
  accent: "#4ADE80",
  bg: "#F0FDF4",
  bgCard: "#DCFCE7",
  bgDark: "#052E16",
  text: "#052E16",
  textMuted: "#166534",
  border: "#BBF7D0",
  borderDark: "#86EFAC",
  white: "#FFFFFF",
};

// Mock data — will be replaced with real Supabase data later
const RADAR_DATA = [
  { skill: "Arrays", score: 80 },
  { skill: "Trees", score: 55 },
  { skill: "DP", score: 40 },
  { skill: "Graphs", score: 65 },
  { skill: "Recursion", score: 70 },
  { skill: "Sorting", score: 85 },
  { skill: "Aptitude", score: 60 },
  { skill: "Strings", score: 75 },
];

const PROGRESS_DATA = [
  { day: "Mon", problems: 3 },
  { day: "Tue", problems: 5 },
  { day: "Wed", problems: 2 },
  { day: "Thu", problems: 7 },
  { day: "Fri", problems: 4 },
  { day: "Sat", problems: 8 },
  { day: "Sun", problems: 6 },
];

const RECENT_PROBLEMS = [
  { title: "Two Sum", topic: "Arrays", difficulty: "Easy", status: "solved" },
  { title: "Binary Tree Inorder", topic: "Trees", difficulty: "Medium", status: "solved" },
  { title: "Longest Common Subsequence", topic: "DP", difficulty: "Hard", status: "attempted" },
  { title: "Number of Islands", topic: "Graphs", difficulty: "Medium", status: "solved" },
  { title: "Climbing Stairs", topic: "DP", difficulty: "Easy", status: "unsolved" },
];

const TODAY_PLAN = [
  { time: "9:00 AM", task: "Arrays — Sliding Window", type: "dsa", done: true },
  { time: "10:30 AM", task: "Aptitude — Number Series", type: "aptitude", done: true },
  { time: "12:00 PM", task: "Trees — Level Order Traversal", type: "dsa", done: false },
  { time: "3:00 PM", task: "Mock Test — 20 Questions", type: "mock", done: false },
];

const DIFF_COLORS = {
  Easy: { bg: "#DCFCE7", text: "#15803D" },
  Medium: { bg: "#FEF9C3", text: "#854D0E" },
  Hard: { bg: "#FEE2E2", text: "#991B1B" },
};

const STATUS_ICONS = {
  solved: { icon: "✅", color: "#15803D" },
  attempted: { icon: "🔄", color: "#854D0E" },
  unsolved: { icon: "⭕", color: "#94A3B8" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [readiness, setReadiness] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [moodSelected, setMoodSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Animate readiness score on mount
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    let count = 0;
    const target = 67;
    const interval = setInterval(() => {
      count += 1;
      setReadiness(count);
      if (count >= target) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  const MOODS = [
    { emoji: "😴", label: "Tired", color: "#94A3B8" },
    { emoji: "😐", label: "Okay", color: "#F59E0B" },
    { emoji: "😊", label: "Focused", color: COLORS.primary },
    { emoji: "🔥", label: "On Fire", color: "#EF4444" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: F.body }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: COLORS.secondary,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        transition: "width 0.3s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Prep<span style={{ color: COLORS.accent }}>Buddy</span></span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 7, fontFamily: F.ui, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Nav Items */}
        {[
          {  label: "Dashboard", path: "/dashboard", active: true },
          {  label: "DSA Practice", path: "/dsa" },
          {  label: "Aptitude", path: "/aptitude" },
          {  label: "Study Planner", path: "/planner" },
          {  label: "Community", path: "/community" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 20px",
              margin: "2px 8px",
              borderRadius: 10,
              cursor: "pointer",
              background: item.active ? "rgba(74,222,128,0.15)" : "transparent",
              borderLeft: item.active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && <span style={{ fontSize: 16, fontWeight: item.active ? 600 : 400, color: item.active ? COLORS.accent : "#86EFAC", whiteSpace: "nowrap" }}>{item.label}</span>}
          </div>
        ))}

        {/* Bottom */}
        <div style={{ marginTop: "auto", padding: "0 8px" }}>
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderRadius: 10, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 18 }}></span>
            {sidebarOpen && <span style={{ fontSize: 16, color: "#86EFAC" }}>Logout</span>}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 4 }}>
              {greeting}, Jyoti 
            </h1>
            <p style={{ fontSize: 16, color: COLORS.textMuted }}>
              You have 2 tasks left for today. Keep going!
            </p>
          </div>

          {/* Mood check-in */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary }}>Today's mood:</span>
            <div style={{ display: "flex", gap: 6 }}>
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMoodSelected(m.label)}
                  title={m.label}
                  style={{
                    background: moodSelected === m.label ? `${m.color}22` : "transparent",
                    border: moodSelected === m.label ? `1.5px solid ${m.color}` : "1.5px solid transparent",
                    borderRadius: 8, padding: "4px 8px", fontFamily: F.ui, cursor: "pointer", fontSize: 18,
                    transition: "all 0.2s",
                  }}>
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 1 — STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Readiness Score", value: `${readiness}%`, icon: "🎯", sub: "+3% this week", color: COLORS.primary },
            { label: "Problems Solved", value: "142", icon: "✅", sub: "8 this week", color: "#2563EB" },
            { label: "Current Streak", value: "12 days", icon: "🔥", sub: "Best: 18 days", color: "#EA580C" },
            { label: "Aptitude Score", value: "74%", icon: "🧮", sub: "+5% from last test", color: "#7C3AED" },
          ].map((card) => (
            <div key={card.label} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500 }}>{card.label}</span>
                <span style={{ fontSize: 20 }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, fontFamily: F.display, color: card.color, marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ROW 2 — RADAR + PROGRESS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* Radar Chart */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px" }}>
            <div style={{ marginBottom: 4 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, margin: 0 }}>Skill Radar</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>Your strengths and blind spots</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={COLORS.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                <Radar name="Score" dataKey="score" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span style={{ fontSize: 11, background: COLORS.bgCard, color: COLORS.textMuted, padding: "3px 10px", borderRadius: 20 }}>💪 Strong: Arrays, Sorting</span>
              <span style={{ fontSize: 11, background: "#FEF9C3", color: "#854D0E", padding: "3px 10px", borderRadius: 20 }}>⚠️ Weak: DP, Trees</span>
            </div>
          </div>

          {/* Weekly Progress */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 4 }}>Weekly Activity</h3>
            <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>Problems solved this week</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PROGRESS_DATA}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 14, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 14, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14 }}
                  formatter={(v) => [`${v} problems`, ""]}
                />
                <Area type="monotone" dataKey="problems" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 3 — TODAY'S PLAN + RECENT PROBLEMS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>

          {/* Today's Plan */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, margin: 0 }}>Today's Plan</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>2 of 4 completed</p>
              </div>
              <button
                onClick={() => navigate("/planner")}
                style={{ fontSize: 14, color: COLORS.primary, fontWeight: 600, background: COLORS.bgCard, border: "none", padding: "6px 12px", borderRadius: 8, fontFamily: F.ui, cursor: "pointer" }}>
                Full Plan →
              </button>
            </div>

            {TODAY_PLAN.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, opacity: item.done ? 0.6 : 1 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: item.done ? COLORS.primary : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", flexShrink: 0 }}>
                  {item.done ? "✓" : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary, textDecoration: item.done ? "line-through" : "none" }}>{item.task}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.time}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                  background: item.type === "dsa" ? COLORS.bgCard : item.type === "aptitude" ? "#FEF9C3" : "#EDE9FE",
                  color: item.type === "dsa" ? COLORS.primary : item.type === "aptitude" ? "#854D0E" : "#6D28D9",
                }}>
                  {item.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Recent Problems */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, margin: 0 }}>Recent Problems</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>Your last 5 attempts</p>
              </div>
              <button
                onClick={() => navigate("/dsa")}
                style={{ fontSize: 14, color: COLORS.primary, fontWeight: 600, background: COLORS.bgCard, border: "none", padding: "6px 12px", borderRadius: 8, fontFamily: F.ui, cursor: "pointer" }}>
                All Problems →
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RECENT_PROBLEMS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 16 }}>{STATUS_ICONS[p.status].icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.topic}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: DIFF_COLORS[p.difficulty].bg, color: DIFF_COLORS[p.difficulty].text }}>
                    {p.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI SUGGESTION BANNER */}
        <div style={{ marginTop: 24, background: COLORS.secondary, borderRadius: 20, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, background: "rgba(74,222,128,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>AI Suggestion for you</div>
              <div style={{ fontSize: 14, color: "#86EFAC" }}>Your DP score is 40% — lower than your target. Solve 3 DP problems today to close the gap.</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/dsa")}
            style={{ background: COLORS.accent, border: "none", color: COLORS.secondary, padding: "10px 22px", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: F.ui, cursor: "pointer", flexShrink: 0 }}>
            Practice DP →
          </button>
        </div>

      </main>
    </div>
  );
}
