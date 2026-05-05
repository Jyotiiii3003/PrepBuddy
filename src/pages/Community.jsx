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

/* ---------------- MOCK DATA ---------------- */

const ROOMS = [
  { name: "DSA Grind Room", users: 6, topic: "Arrays" },
  { name: "Aptitude Practice", users: 4, topic: "Quant" },
  { name: "Placement Prep", users: 9, topic: "Mixed" },
];

const FUN_ROOM = [
  { user: "Aman", text: "What was your toughest DSA question today?" },
  { user: "Priya", text: "Anyone else stuck on DP?" },
];

const LEADERBOARD = [
  { name: "Rahul", score: 92 },
  { name: "Priya", score: 88 },
  { name: "Aman", score: 85 },
  { name: "You", score: 80 },
];

/* ---------------- COMPONENT ---------------- */

export default function Community() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [funChat, setFunChat] = useState(FUN_ROOM);

  const sendMessage = () => {
    if (!message.trim()) return;
    setFunChat([{ user: "You", text: message }, ...funChat]);
    setMessage("");
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
          { label: "Community", path: "/community" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              color: "#86EFAC",
              fontWeight: item.label === "Community" ? 600 : 400
            }}
          >
            {sidebarOpen && item.label}
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "32px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 6
          }}>
            Community
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 15 }}>
            Collaborate, compete, and stay consistent
          </p>
        </div>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.3fr",
          gap: 20
        }}>

          {/* STUDY ROOMS */}
          <div style={card}>
            <h3 style={title}>Study Rooms</h3>

            {ROOMS.map((room, i) => (
              <div
                key={i}
                style={roomCard}
                onMouseEnter={e => e.currentTarget.style.background = "#ECFDF5"}
                onMouseLeave={e => e.currentTarget.style.background = "#F9FAFB"}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{room.name}</div>
                  <small style={{ color: COLORS.textMuted }}>{room.topic}</small>
                </div>

                <span style={badge}>
                  {room.users} active
                </span>
              </div>
            ))}

            <button style={btn}>Create Room</button>
          </div>

          {/* LEADERBOARD */}
          <div style={card}>
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

          {/* FUN ROOM */}
          <div style={card}>
            <h3 style={title}>Fun Room</h3>

            {/* INPUT */}
            <div style={{ marginBottom: 12 }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share something..."
                style={input}
              />
              <button onClick={sendMessage} style={btn}>
                Send
              </button>
            </div>

            {/* CHAT */}
            {funChat.map((msg, i) => (
              <div
                key={i}
                style={post}
                onMouseEnter={e => e.currentTarget.style.background = "#ECFDF5"}
                onMouseLeave={e => e.currentTarget.style.background = "#F9FAFB"}
              >
                <strong>{msg.user}</strong>
                <p style={{ margin: "4px 0 0" }}>{msg.text}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(187,247,208,0.6)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const title = {
  marginBottom: 16,
  fontSize: 18,
  fontWeight: 700,
};

const roomCard = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#F9FAFB",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  transition: "0.2s",
};

const badge = {
  fontSize: 12,
  background: "#DCFCE7",
  padding: "4px 10px",
  borderRadius: 20,
};

const btn = {
  marginTop: 12,
  padding: "10px 16px",
  background: "linear-gradient(135deg, #16A34A, #22C55E)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(22,163,74,0.25)",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #BBF7D0",
  marginBottom: 10,
  outline: "none",
};

const post = {
  background: "#F9FAFB",
  borderRadius: 12,
  padding: 12,
  marginTop: 10,
  transition: "0.2s",
};