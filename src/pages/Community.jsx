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

/* ---------------- DATA ---------------- */

const ROOMS = [
  { name: "DSA Grind", users: 12 },
  { name: "Aptitude Zone", users: 7 },
  { name: "Mock Battle", users: 5 },
];

const FEED = [
  { user: "Aman", type: "question", text: "How to approach DP problems?" },
  { user: "Priya", type: "activity", text: "Solved 5 problems today" },
  { user: "Rahul", type: "question", text: "Best way to revise trees?" },
];

const LEADERBOARD = [
  { name: "Rahul", score: 98 },
  { name: "Priya", score: 91 },
  { name: "Aman", score: 87 },
  { name: "You", score: 80 },
];

/* ---------------- COMPONENT ---------------- */

export default function Community() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feed, setFeed] = useState(FEED);
  const [input, setInput] = useState("");

  const post = () => {
    if (!input.trim()) return;

    setFeed([
      { user: "You", type: "question", text: input },
      ...feed,
    ]);

    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg }}>

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
          { label: "DSA", path: "/dsa" },
          { label: "Aptitude", path: "/aptitude" },
          { label: "Planner", path: "/planner" },
          { label: "Community", path: "/community" },
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

      {/* MAIN GRID */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "240px 1fr 280px",
        gap: 16,
        padding: 20
      }}>

        {/* LEFT → ROOMS */}
        <div style={panel}>
          <h3 style={title}>Rooms</h3>

          {ROOMS.map((room, i) => (
            <div key={i} style={roomCard}>
              <div>
                <div style={{ fontWeight: 600 }}>{room.name}</div>
                <small>{room.users} active</small>
              </div>

              <button style={joinBtn}>Join</button>
            </div>
          ))}
        </div>

        {/* CENTER → LIVE FEED */}
        <div style={panel}>
          <h3 style={title}>Live Feed</h3>

          {/* INPUT */}
          <div style={{ marginBottom: 12 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={inputStyle}
            />
            <button onClick={post} style={btn}>Post</button>
          </div>

          {/* FEED */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {feed.map((item, i) => (
              <div key={i} style={{
                padding: 12,
                borderRadius: 12,
                background: item.type === "question" ? "#FEF9C3" : "#DCFCE7"
              }}>
                <strong>{item.user}</strong>
                <p style={{ margin: "4px 0 0" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT → LEADERBOARD */}
        <div style={panel}>
          <h3 style={title}>Leaderboard</h3>

          {LEADERBOARD.map((user, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 10,
              background: i === 0 ? "#ECFDF5" : "transparent",
              fontWeight: i === 0 ? 700 : 500
            }}>
              <span>{i + 1}. {user.name}</span>
              <span>{user.score}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const panel = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: "1px solid #BBF7D0",
  overflowY: "auto",
};

const title = {
  marginBottom: 12,
  fontWeight: 700,
};

const roomCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  borderRadius: 10,
  background: "#F9FAFB",
  marginBottom: 10,
};

const joinBtn = {
  padding: "6px 10px",
  background: "#16A34A",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btn = {
  marginTop: 8,
  padding: "8px 12px",
  background: "#16A34A",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #BBF7D0",
};