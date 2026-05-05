import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

/* ---------------- MOCK DATA ---------------- */

const INITIAL_PLAN = [
  {
    day: "Monday",
    tasks: [
      { time: "9:00 AM", task: "Arrays - Sliding Window", type: "DSA", done: true },
      { time: "11:00 AM", task: "Aptitude - Time & Work", type: "APT", done: false },
      { time: "3:00 PM", task: "Mock Test", type: "MOCK", done: false },
    ],
  },
  {
    day: "Tuesday",
    tasks: [
      { time: "10:00 AM", task: "Trees - Traversal", type: "DSA", done: false },
      { time: "2:00 PM", task: "Number Series", type: "APT", done: false },
    ],
  },
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

/* ---------------- COMPONENT ---------------- */

export default function Planner() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [target, setTarget] = useState("Google");
  const [hours, setHours] = useState(3);

  /* ---------- TOGGLE TASK ---------- */
  const toggleTask = (dayIndex, taskIndex) => {
    const updated = [...plan];
    updated[dayIndex].tasks[taskIndex].done =
      !updated[dayIndex].tasks[taskIndex].done;
    setPlan(updated);
  };

  const totalTasks = plan.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = plan.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.done).length,
    0
  );

  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 64,
          background: COLORS.secondary,
          padding: "20px 0",
          transition: "0.3s",
        }}
      >
        <div style={{ padding: "0 16px 20px", display: "flex", justifyContent: "space-between" }}>
          {sidebarOpen && <span style={{ color: "#fff", fontWeight: 700 }}>PrepBuddy</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>◀</button>
        </div>

        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "DSA", path: "/dsa" },
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

      {/* MAIN */}
      <main style={{ flex: 1, padding: "28px" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Study Planner </h1>
            <p style={{ color: COLORS.textMuted }}>
              Your AI-powered weekly roadmap
            </p>
          </div>

          <button
            style={{
              background: COLORS.primary,
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
             Regenerate Plan
          </button>
        </div>

        {/* PROGRESS CARDS */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={cardStyle}>
            <h3>Progress</h3>
            <p style={{ fontSize: 28, fontWeight: 800 }}>{progress}%</p>
          </div>
          <div style={cardStyle}>
            <h3>Completed</h3>
            <p>{completedTasks} tasks</p>
          </div>
          <div style={cardStyle}>
            <h3>Remaining</h3>
            <p>{totalTasks - completedTasks}</p>
          </div>
        </div>

        {/* CHART */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h3>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY_PROGRESS}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="value" stroke={COLORS.primary} fill={COLORS.primary} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PLAN */}
        {plan.map((day, dIndex) => (
          <div key={day.day} style={{ ...cardStyle, marginBottom: 16 }}>
            <h3>{day.day}</h3>

            {day.tasks.map((task, tIndex) => (
              <div
                key={tIndex}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  opacity: task.done ? 0.6 : 1,
                }}
              >
                <div>
                  <div
                    style={{
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.task}
                  </div>
                  <small>{task.time}</small>
                </div>

                <button onClick={() => toggleTask(dIndex, tIndex)}>
                  {task.done ? "✓" : "○"}
                </button>
              </div>
            ))}
          </div>
        ))}

        {/* SETTINGS */}
        <div style={cardStyle}>
          <h3> Customize Plan</h3>

          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target Company"
              style={inputStyle}
            />
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Hours/day"
              style={inputStyle}
            />
          </div>

          <button style={{ marginTop: 12, ...btnStyle }}>
            Generate Plan
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const cardStyle = {
  background: "#fff",
  border: "1px solid #BBF7D0",
  borderRadius: 16,
  padding: 20,
};

const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #BBF7D0",
};

const btnStyle = {
  background: "#16A34A",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};