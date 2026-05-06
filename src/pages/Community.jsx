import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { F } from "../utils/theme";
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

const LEADERBOARD = [
  { rank: 1, name: "Rahul Singh", college: "NIT Trichy", score: 980, streak: 24, avatar: "RS", solved: 142 },
  { rank: 2, name: "Priya Sharma", college: "VIT Vellore", score: 920, streak: 18, avatar: "PS", solved: 128 },
  { rank: 3, name: "Aman Gupta", college: "BITS Pilani", score: 875, streak: 15, avatar: "AG", solved: 115 },
  { rank: 4, name: "Sneha Patel", college: "SRM Chennai", score: 820, streak: 12, avatar: "SP", solved: 104 },
  { rank: 5, name: "You", college: "Your College", score: 800, streak: 12, avatar: "ME", solved: 98, isYou: true },
  { rank: 6, name: "Kiran Rao", college: "Amity University", score: 770, streak: 9, avatar: "KR", solved: 91 },
  { rank: 7, name: "Divya Nair", college: "LPU", score: 740, streak: 7, avatar: "DN", solved: 85 },
];

const ROOMS = [
  { name: "DSA Grind", topic: "Arrays & Strings", users: 12, active: true },
  { name: "Aptitude Zone", topic: "Quant Practice", users: 7, active: true },
  { name: "Mock Battle", topic: "Timed Mock Test", users: 5, active: false },
  { name: "DP Deep Dive", topic: "Dynamic Programming", users: 3, active: false },
];

const INITIAL_FEED = [
  { id: 1, user: "Rahul Singh", avatar: "RS", type: "question", text: "How do you approach DP problems from scratch? I always get stuck on the state definition.", time: "5m ago", likes: 8, college: "NIT Trichy" },
  { id: 2, user: "Priya Sharma", avatar: "PS", type: "achievement", text: "Just solved my 100th LeetCode problem! 🎉 Arrays finally make sense now.", time: "12m ago", likes: 24, college: "VIT Vellore" },
  { id: 3, user: "Aman Gupta", avatar: "AG", type: "tip", text: "Tip: Always draw the recursion tree before coding any DP or recursion problem. Saved me so many times!", time: "28m ago", likes: 15, college: "BITS Pilani" },
  { id: 4, user: "Sneha Patel", avatar: "SP", type: "question", text: "Best resources for aptitude prep for TCS NQT? The syllabus is huge.", time: "1h ago", likes: 6, college: "SRM Chennai" },
];

const POST_TYPES = [
  { key: "question", label: "Ask a Question", icon: "❓", color: "#FEF9C3", textColor: "#854D0E" },
  { key: "tip", label: "Share a Tip", icon: "💡", color: COLORS.bgCard, textColor: COLORS.primary },
  { key: "achievement", label: "Share Achievement", icon: "🏆", color: "#EDE9FE", textColor: "#6D28D9" },
];

const RANK_MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Community() {
  const navigate = useNavigate();
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [input, setInput] = useState("");
  const [postType, setPostType] = useState("question");
  const [likedPosts, setLikedPosts] = useState({});
  const [activeTab, setActiveTab] = useState("feed"); // feed | leaderboard | rooms
  const [collegeFilter, setCollegeFilter] = useState("All");
  const [joinedRooms, setJoinedRooms] = useState({});

  const post = () => {
    if (!input.trim()) return;
    const newPost = {
      id: Date.now(),
      user: "You",
      avatar: "ME",
      type: postType,
      text: input,
      time: "Just now",
      likes: 0,
      college: "Your College",
    };
    setFeed([newPost, ...feed]);
    setInput("");
  };

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    setFeed(prev => prev.map(p => p.id === id ? { ...p, likes: likedPosts[id] ? p.likes - 1 : p.likes + 1 } : p));
  };

  const NAV = [
    {  label: "Dashboard", path: "/dashboard" },
    {  label: "DSA Practice", path: "/dsa" },
    {  label: "Aptitude", path: "/aptitude" },
    {  label: "Study Planner", path: "/planner" },
    {  label: "Community", path: "/community", active: true },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: F.body }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: COLORS.secondary, display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div onClick={() => navigate("/")} style={{ padding: "0 16px 24px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Prep<span style={{ color: COLORS.accent }}>Buddy</span></span>
        </div>
        {NAV.map(item => (
          <div key={item.label} onClick={() => navigate(item.path)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", margin: "2px 8px", borderRadius: 10, fontFamily: F.ui, cursor: "pointer", background: item.active ? "rgba(74,222,128,0.15)" : "transparent", borderLeft: item.active ? `3px solid ${COLORS.accent}` : "3px solid transparent" }}
            onMouseEnter={e => !item.active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => !item.active && (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 16, fontWeight: item.active ? 600 : 400, color: item.active ? COLORS.accent : "#86EFAC" }}>{item.label}</span>
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: 1100 }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 4 }}>Community 👥</h1>
          <p style={{ fontSize: 16, color: COLORS.textMuted }}>Connect, compete and grow with your batchmates</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.white, borderRadius: 12, padding: 4, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
          {[
            { key: "feed", label: "Live Feed", icon: "📣" },
            { key: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { key: "rooms", label: "Study Rooms", icon: "🚪" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: activeTab === tab.key ? COLORS.primary : "transparent", color: activeTab === tab.key ? "#fff" : COLORS.textMuted, fontSize: 16, fontWeight: activeTab === tab.key ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* LIVE FEED TAB */}
        {activeTab === "feed" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
            <div>
              {/* Post composer */}
              <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {POST_TYPES.map(pt => (
                    <button key={pt.key} onClick={() => setPostType(pt.key)}
                      style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${postType === pt.key ? COLORS.primary : COLORS.border}`, background: postType === pt.key ? COLORS.bgCard : "transparent", color: postType === pt.key ? COLORS.primary : COLORS.textMuted, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                      {pt.icon} {pt.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={postType === "question" ? "What are you stuck on? Ask the community..." : postType === "tip" ? "Share a helpful tip or trick..." : "Share your achievement! 🎉"}
                  style={{ width: "100%", height: 80, padding: "12px", borderRadius: 12, border: `1.5px solid ${COLORS.border}`, fontSize: 16, color: COLORS.text, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button onClick={post}
                    style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "9px 22px", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: F.ui, cursor: "pointer" }}>
                    Post →
                  </button>
                </div>
              </div>

              {/* Feed */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {feed.map(item => {
                  const typeStyle = POST_TYPES.find(p => p.key === item.type) || POST_TYPES[0];
                  return (
                    <div key={item.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.accent, flexShrink: 0 }}>
                          {item.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.secondary }}>{item.user}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.college} · {item.time}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: typeStyle.color, color: typeStyle.textColor }}>
                          {typeStyle.icon} {typeStyle.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6, margin: "0 0 14px" }}>{item.text}</p>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <button onClick={() => toggleLike(item.id)}
                          style={{ background: likedPosts[item.id] ? COLORS.bgCard : "transparent", border: `1px solid ${likedPosts[item.id] ? COLORS.borderDark : COLORS.border}`, color: likedPosts[item.id] ? COLORS.primary : COLORS.textMuted, padding: "5px 14px", borderRadius: 20, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                          {likedPosts[item.id] ? "❤️" : "🤍"} {item.likes}
                        </button>
                        <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 14, cursor: "pointer" }}>
                          💬 Reply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right sidebar — mini leaderboard */}
            <div>
              <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 16 }}>🏆 Top This Week</h3>
                {LEADERBOARD.slice(0, 5).map(u => (
                  <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: u.rank < 5 ? `1px solid ${COLORS.border}` : "none" }}>
                    <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{RANK_MEDALS[u.rank] || `#${u.rank}`}</span>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.isYou ? COLORS.primary : COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: u.isYou ? "#fff" : COLORS.accent, flexShrink: 0 }}>{u.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: u.isYou ? 700 : 500, color: u.isYou ? COLORS.primary : COLORS.secondary }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{u.score} pts</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setActiveTab("leaderboard")} style={{ marginTop: 14, width: "100%", background: COLORS.bgCard, border: "none", color: COLORS.primary, padding: "9px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                  View Full Leaderboard →
                </button>
              </div>

              {/* Active rooms mini */}
              <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "20px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 16 }}>🚪 Active Rooms</h3>
                {ROOMS.filter(r => r.active).map(r => (
                  <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{r.users} studying</div>
                    </div>
                    <button style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "5px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>Join</button>
                  </div>
                ))}
                <button onClick={() => setActiveTab("rooms")} style={{ marginTop: 8, width: "100%", background: COLORS.bgCard, border: "none", color: COLORS.primary, padding: "9px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                  All Rooms →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {["All", "NIT Trichy", "VIT Vellore", "BITS Pilani", "Your College"].map(c => (
                <button key={c} onClick={() => setCollegeFilter(c)}
                  style={{ padding: "7px 16px", borderRadius: 100, border: `1.5px solid ${collegeFilter === c ? COLORS.primary : COLORS.border}`, background: collegeFilter === c ? COLORS.primary : COLORS.white, color: collegeFilter === c ? "#fff" : COLORS.textMuted, fontSize: 14, fontWeight: 500, fontFamily: F.ui, cursor: "pointer" }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Top 3 podium */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((u, i) => {
                const heights = [180, 220, 160];
                const isFirst = i === 1;
                return (
                  <div key={u.rank} style={{ textAlign: "center", width: 140 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{RANK_MEDALS[u.rank]}</div>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: isFirst ? COLORS.primary : COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: isFirst ? "#fff" : COLORS.accent, margin: "0 auto 8px" }}>{u.avatar}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.secondary }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8 }}>{u.college}</div>
                    <div style={{ height: heights[i], background: isFirst ? COLORS.primary : COLORS.bgCard, borderRadius: "12px 12px 0 0", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: isFirst ? "#fff" : COLORS.primary }}>
                      {u.score}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full table */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 160px 80px 100px 90px", padding: "12px 20px", background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}` }}>
                {["Rank", "Student", "College", "Solved", "Streak", "Score"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                ))}
              </div>
              {LEADERBOARD.map((u, i) => (
                <div key={u.rank} style={{ display: "grid", gridTemplateColumns: "50px 1fr 160px 80px 100px 90px", padding: "14px 20px", borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${COLORS.border}` : "none", background: u.isYou ? COLORS.bgCard : "transparent", alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>{RANK_MEDALS[u.rank] || `#${u.rank}`}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.isYou ? COLORS.primary : COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: u.isYou ? "#fff" : COLORS.accent, flexShrink: 0 }}>{u.avatar}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: u.isYou ? 700 : 500, color: u.isYou ? COLORS.primary : COLORS.secondary }}>{u.name} {u.isYou ? "(You)" : ""}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>{u.college}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary }}>{u.solved}</span>
                  <span style={{ fontSize: 14, color: "#EA580C", fontWeight: 600 }}>🔥 {u.streak} days</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.primary }}>{u.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROOMS TAB */}
        {activeTab === "rooms" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {ROOMS.map(room => (
                <div key={room.name} style={{ background: COLORS.white, border: `1px solid ${joinedRooms[room.name] ? COLORS.borderDark : COLORS.border}`, borderRadius: 20, padding: "24px", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: COLORS.bgCard, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {room.name.includes("DSA") ? "💻" : room.name.includes("Aptitude") ? "🧮" : room.name.includes("Mock") ? "⏱️" : "📚"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: room.active ? "#22C55E" : "#94A3B8" }} />
                      <span style={{ fontSize: 11, color: room.active ? "#15803D" : "#94A3B8", fontWeight: 600 }}>{room.active ? "Active" : "Quiet"}</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.secondary, marginBottom: 4 }}>{room.name}</h3>
                  <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>{room.topic}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: COLORS.textMuted }}>👥 {room.users} studying now</span>
                    <button
                      onClick={() => setJoinedRooms(prev => ({ ...prev, [room.name]: !prev[room.name] }))}
                      style={{ background: joinedRooms[room.name] ? COLORS.bgCard : COLORS.primary, border: joinedRooms[room.name] ? `1px solid ${COLORS.borderDark}` : "none", color: joinedRooms[room.name] ? COLORS.primary : "#fff", padding: "8px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: F.ui, cursor: "pointer" }}>
                      {joinedRooms[room.name] ? "✓ Joined" : "Join Room"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Create room card */}
              <div style={{ background: "transparent", border: `2px dashed ${COLORS.border}`, borderRadius: 20, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: 200 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderDark; e.currentTarget.style.background = COLORS.bgCard; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>+</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 4 }}>Create a Room</div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center" }}>Start a study room and invite your batchmates</div>
              </div>
            </div>

            {/* How rooms work */}
            <div style={{ marginTop: 24, background: COLORS.secondary, borderRadius: 18, padding: "20px 28px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, background: "rgba(74,222,128,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🚪</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>How Study Rooms work</div>
                <div style={{ fontSize: 14, color: "#86EFAC" }}>Join a room to see each other's progress in real time — like a virtual library. No video, just presence, progress bars and shared chat.</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
