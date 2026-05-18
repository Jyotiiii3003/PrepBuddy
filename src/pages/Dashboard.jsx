import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getProgressStats } from "../utils/api";

const F = {
  display: "'Clash Display', 'Sora', sans-serif",
  body: "'Sora', 'Segoe UI', sans-serif",
  ui: "'Nunito', 'Sora', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
  primary: "#16A34A", secondary: "#14532D", accent: "#4ADE80",
  bg: "#F0FDF4", bgCard: "#DCFCE7", text: "#052E16",
  textMuted: "#166634", border: "#BBF7D0", borderDark: "#86EFAC", white: "#FFFFFF",
};

const RADAR_DATA = [
  { skill: "Arrays", score: 80 }, { skill: "Trees", score: 55 },
  { skill: "DP", score: 40 }, { skill: "Graphs", score: 65 },
  { skill: "Recursion", score: 70 }, { skill: "Sorting", score: 85 },
  { skill: "Aptitude", score: 60 }, { skill: "Strings", score: 75 },
];

const PROGRESS_DATA = [
  { day: "Mon", problems: 3 }, { day: "Tue", problems: 5 },
  { day: "Wed", problems: 2 }, { day: "Thu", problems: 7 },
  { day: "Fri", problems: 4 }, { day: "Sat", problems: 8 }, { day: "Sun", problems: 6 },
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

const STATUS_ICONS = { solved: "✅", attempted: "🔄", unsolved: "⭕" };

const NAV = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard", active: true },
  { icon: "💻", label: "DSA Practice", path: "/dsa" },
  { icon: "🧮", label: "Aptitude", path: "/aptitude" },
  { icon: "📅", label: "Study Planner", path: "/planner" },
  { icon: "👥", label: "Community", path: "/community" },
];

// ── MOODS defined at module level ─────────────────────────
const MOODS = [
  { emoji: "😴", label: "Tired",   color: "#94A3B8" },
  { emoji: "😐", label: "Okay",    color: "#F59E0B" },
  { emoji: "😊", label: "Focused", color: C.primary  },
  { emoji: "🔥", label: "On Fire", color: "#EF4444"  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [stats, setStats]               = useState(null);
  const [readiness, setReadiness]       = useState(0);
  const [greeting, setGreeting]         = useState("");
  const [moodSelected, setMoodSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    getProgressStats()
      .then(data => {
        setStats(data);
        const target = Math.min(Math.round((data.solved / 50) * 100), 100);
        let count = 0;
        const interval = setInterval(() => {
          count += 1;
          setReadiness(count);
          if (count >= target) clearInterval(interval);
        }, 18);
      })
      .catch(() => {
        // No progress yet — keep readiness at 0
        setReadiness(0);
      });
  }, []);

  const handleLogout = () => {
    authLogout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: F.body }}>

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 248 : 68, background: C.secondary, display: "flex", flexDirection: "column", padding: "22px 0", transition: "width 0.3s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ padding: "0 16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
              <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Prep<span style={{ color: C.accent }}>Buddy</span></span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {NAV.map(item => (
          <div key={item.label} onClick={() => navigate(item.path)}
            style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 20px", margin: "2px 8px", borderRadius: 11, cursor: "pointer", background: item.active ? "rgba(74,222,128,0.15)" : "transparent", borderLeft: item.active ? `3px solid ${C.accent}` : "3px solid transparent", transition: "background 0.2s" }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 19, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && <span style={{ fontFamily: F.ui, fontSize: 15, fontWeight: item.active ? 700 : 500, color: item.active ? C.accent : "#86EFAC", whiteSpace: "nowrap" }}>{item.label}</span>}
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "0 8px" }}>
          <div onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 20px", borderRadius: 11, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 19 }}>🚪</span>
            {sidebarOpen && <span style={{ fontFamily: F.ui, fontSize: 15, color: "#86EFAC", fontWeight: 500 }}>Logout</span>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", padding: "30px 36px" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: "clamp(1.7rem, 2.5vw, 2.3rem)", fontWeight: 700, color: C.secondary, marginBottom: 6, letterSpacing: "-0.02em" }}>
              {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p style={{ fontFamily: F.body, fontSize: 16, color: C.textMuted }}>
              You have {TODAY_PLAN.filter(t => !t.done).length} tasks left for today. Keep going!
            </p>
          </div>

          {/* Mood check-in */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary }}>Today's mood:</span>
            <div style={{ display: "flex", gap: 6 }}>
              {MOODS.map(m => (
                <button key={m.label} onClick={() => setMoodSelected(m.label)} title={m.label}
                  style={{ background: moodSelected === m.label ? `${m.color}22` : "transparent", border: moodSelected === m.label ? `1.5px solid ${m.color}` : "1.5px solid transparent", borderRadius: 9, padding: "5px 9px", cursor: "pointer", fontSize: 20, transition: "all 0.2s" }}>
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 26 }}>
          {[
            { label: "Readiness Score", value: `${readiness}%`,             icon: "🎯", sub: "+3% this week",    color: C.primary  },
            { label: "Problems Solved", value: stats?.solved    || 0,        icon: "✅", sub: "Keep going!",       color: "#2563EB" },
            { label: "Current Streak",  value: `${stats?.streak || 0} days`, icon: "🔥", sub: "Stay consistent!",  color: "#EA580C" },
            { label: "Attempted",       value: stats?.attempted || 0,        icon: "🔄", sub: "Try to solve them", color: "#7C3AED" },
          ].map(card => (
            <div key={card.label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ fontFamily: F.ui, fontSize: 14, color: C.textMuted, fontWeight: 600 }}>{card.label}</span>
                <span style={{ fontSize: 22 }}>{card.icon}</span>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 34, fontWeight: 600, color: card.color, marginBottom: 6, letterSpacing: "-0.02em" }}>{card.value}</div>
              <div style={{ fontFamily: F.ui, fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* RADAR + PROGRESS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 26 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "26px" }}>
            <h3 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.secondary, marginBottom: 4 }}>Skill Radar</h3>
            <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted, marginBottom: 4 }}>Your strengths and blind spots</p>
            <ResponsiveContainer width="100%" height={270}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: C.textMuted, fontFamily: F.ui, fontWeight: 600 }} />
                <Radar name="Score" dataKey="score" stroke={C.primary} fill={C.primary} fillOpacity={0.2} strokeWidth={2.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 600, background: C.bgCard, color: C.textMuted, padding: "3px 12px", borderRadius: 20 }}>💪 Strong: Arrays, Sorting</span>
              <span style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 600, background: "#FEF9C3", color: "#854D0E", padding: "3px 12px", borderRadius: 20 }}>⚠️ Weak: DP, Trees</span>
            </div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "26px" }}>
            <h3 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.secondary, marginBottom: 4 }}>Weekly Activity</h3>
            <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted, marginBottom: 16 }}>Problems solved this week</p>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={PROGRESS_DATA}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 13, fill: C.textMuted, fontFamily: F.ui, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: C.textMuted, fontFamily: F.ui }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.ui }} formatter={v => [`${v} problems`, ""]} />
                <Area type="monotone" dataKey="problems" stroke={C.primary} strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: C.primary, strokeWidth: 2, r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TODAY'S PLAN + RECENT PROBLEMS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <h3 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.secondary, margin: 0 }}>Today's Plan</h3>
                <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted, marginTop: 4 }}>
                  {TODAY_PLAN.filter(t => t.done).length} of {TODAY_PLAN.length} completed
                </p>
              </div>
              <button onClick={() => navigate("/planner")}
                style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, color: C.primary, background: C.bgCard, border: "none", padding: "7px 14px", borderRadius: 9, cursor: "pointer" }}>
                Full Plan →
              </button>
            </div>
            {TODAY_PLAN.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16, opacity: item.done ? 0.6 : 1 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.done ? C.primary : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>
                  {item.done ? "✓" : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, color: C.secondary, textDecoration: item.done ? "line-through" : "none" }}>{item.task}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{item.time}</div>
                </div>
                <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: item.type === "dsa" ? C.bgCard : item.type === "aptitude" ? "#FEF9C3" : "#EDE9FE", color: item.type === "dsa" ? C.primary : item.type === "aptitude" ? "#854D0E" : "#6D28D9" }}>
                  {item.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <h3 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.secondary, margin: 0 }}>Recent Problems</h3>
                <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted, marginTop: 4 }}>Your last 5 attempts</p>
              </div>
              <button onClick={() => navigate("/dsa")}
                style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, color: C.primary, background: C.bgCard, border: "none", padding: "7px 14px", borderRadius: 9, cursor: "pointer" }}>
                All Problems →
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RECENT_PROBLEMS.map((p, i) => (
                <div key={i}
                  style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", borderRadius: 13, border: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 18 }}>{STATUS_ICONS[p.status]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, color: C.secondary }}>{p.title}</div>
                    <div style={{ fontFamily: F.ui, fontSize: 13, color: C.textMuted, fontWeight: 500, marginTop: 2 }}>{p.topic}</div>
                  </div>
                  <span style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: DIFF_COLORS[p.difficulty].bg, color: DIFF_COLORS[p.difficulty].text }}>
                    {p.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI BANNER */}
        <div style={{ marginTop: 24, background: C.secondary, borderRadius: 22, padding: "22px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 48, height: 48, background: "rgba(74,222,128,0.15)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontFamily: F.body, fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 5 }}>AI Suggestion for you</div>
              <div style={{ fontFamily: F.body, fontSize: 15, color: "#86EFAC" }}>
                {stats?.solved > 0
                  ? `You have solved ${stats.solved} problems. Keep pushing — target 50 to boost your readiness score!`
                  : "Start solving DSA problems to get personalized AI suggestions based on your weak topics."}
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/dsa")}
            style={{ fontFamily: F.ui, background: C.accent, border: "none", color: C.secondary, padding: "11px 24px", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
            Practice Now →
          </button>
        </div>

      </main>
    </div>
  );
}
