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

const LEADERBOARD = [
  { rank:1, name:"Rahul Singh",  college:"NIT Trichy",   score:980, streak:24, avatar:"RS", solved:142 },
  { rank:2, name:"Priya Sharma", college:"VIT Vellore",  score:920, streak:18, avatar:"PS", solved:128 },
  { rank:3, name:"Aman Gupta",   college:"BITS Pilani",  score:875, streak:15, avatar:"AG", solved:115 },
  { rank:4, name:"Sneha Patel",  college:"SRM Chennai",  score:820, streak:12, avatar:"SP", solved:104 },
  { rank:5, name:"You",          college:"Your College", score:800, streak:12, avatar:"ME", solved:98,  isYou:true },
  { rank:6, name:"Kiran Rao",    college:"Amity Univ.",  score:770, streak:9,  avatar:"KR", solved:91  },
  { rank:7, name:"Divya Nair",   college:"LPU",          score:740, streak:7,  avatar:"DN", solved:85  },
];

const ROOMS = [
  { name:"DSA Grind",    topic:"Arrays & Strings",      users:12, active:true  },
  { name:"Aptitude Zone",topic:"Quant Practice",        users:7,  active:true  },
  { name:"Mock Battle",  topic:"Timed Mock Test",       users:5,  active:false },
  { name:"DP Deep Dive", topic:"Dynamic Programming",   users:3,  active:false },
];

const INITIAL_FEED = [
  { id:1, user:"Rahul Singh",  avatar:"RS", type:"question",    text:"How do you approach DP problems from scratch? I always get stuck on the state definition.", time:"5m ago",  likes:8,  college:"NIT Trichy"  },
  { id:2, user:"Priya Sharma", avatar:"PS", type:"achievement", text:"Just solved my 100th LeetCode problem! 🎉 Arrays finally make sense now.",                  time:"12m ago", likes:24, college:"VIT Vellore"  },
  { id:3, user:"Aman Gupta",   avatar:"AG", type:"tip",         text:"Tip: Always draw the recursion tree before coding any DP or recursion problem. Saved me so many times!", time:"28m ago", likes:15, college:"BITS Pilani" },
  { id:4, user:"Sneha Patel",  avatar:"SP", type:"question",    text:"Best resources for aptitude prep for TCS NQT? The syllabus is huge.",                       time:"1h ago",  likes:6,  college:"SRM Chennai" },
];

const POST_TYPES = [
  { key:"question",    label:"Ask a Question",   icon:"❓", color:"#FEF9C3", textColor:"#854D0E" },
  { key:"tip",         label:"Share a Tip",      icon:"💡", color:C.bgCard,  textColor:C.primary },
  { key:"achievement", label:"Achievement",      icon:"🏆", color:"#EDE9FE", textColor:"#6D28D9" },
];

const RANK_MEDALS = { 1:"🥇", 2:"🥈", 3:"🥉" };

const NAV = [
  { icon:"🏠", label:"Dashboard",    path:"/dashboard" },
  { icon:"💻", label:"DSA Practice", path:"/dsa" },
  { icon:"🧮", label:"Aptitude",     path:"/aptitude" },
  { icon:"📅", label:"Study Planner",path:"/planner" },
  { icon:"👥", label:"Community",    path:"/community", active:true },
];

export default function Community() {
  const navigate = useNavigate();
  const [feed, setFeed]               = useState(INITIAL_FEED);
  const [input, setInput]             = useState("");
  const [postType, setPostType]       = useState("question");
  const [likedPosts, setLikedPosts]   = useState({});
  const [activeTab, setActiveTab]     = useState("feed");
  const [joinedRooms, setJoinedRooms] = useState({});

  const post = () => {
    if (!input.trim()) return;
    setFeed([{ id:Date.now(), user:"You", avatar:"ME", type:postType, text:input, time:"Just now", likes:0, college:"Your College" }, ...feed]);
    setInput("");
  };

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]:!prev[id] }));
    setFeed(prev => prev.map(p => p.id===id ? { ...p, likes:likedPosts[id]?p.likes-1:p.likes+1 } : p));
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:F.body }}>

      {/* SIDEBAR */}
      <aside style={{ width:220, background:C.secondary, display:"flex", flexDirection:"column", padding:"20px 0", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div onClick={() => navigate("/")} style={{ padding:"0 16px 24px", display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
          <div style={{ width:30, height:30, background:C.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚡</div>
          <span style={{ fontFamily:F.display, fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>Prep<span style={{ color:C.accent }}>Buddy</span></span>
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
      <main style={{ flex:1, padding:"30px 36px", overflowY:"auto", maxWidth:1100 }}>

        {/* HEADER */}
        <div style={{ marginBottom:26 }}>
          <h1 style={{ fontFamily:F.display, fontSize:"clamp(1.7rem, 2.5vw, 2.3rem)", fontWeight:700, color:C.secondary, marginBottom:6, letterSpacing:"-0.02em" }}>
            Community 👥
          </h1>
          <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted }}>Connect, compete and grow with your batchmates</p>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:4, marginBottom:26, background:C.white, borderRadius:13, padding:4, border:`1px solid ${C.border}`, width:"fit-content" }}>
          {[
            { key:"feed",        label:"Live Feed",      icon:"📣" },
            { key:"leaderboard", label:"Leaderboard",    icon:"🏆" },
            { key:"rooms",       label:"Study Rooms",    icon:"🚪" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding:"10px 22px", borderRadius:10, border:"none", background:activeTab===tab.key?C.primary:"transparent", color:activeTab===tab.key?"#fff":C.textMuted, fontFamily:F.ui, fontSize:15, fontWeight:activeTab===tab.key?800:600, cursor:"pointer", transition:"all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── LIVE FEED ── */}
        {activeTab === "feed" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:22 }}>

            {/* Feed column */}
            <div>
              {/* Composer */}
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"22px", marginBottom:20 }}>
                <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                  {POST_TYPES.map(pt => (
                    <button key={pt.key} onClick={() => setPostType(pt.key)}
                      style={{ fontFamily:F.ui, padding:"7px 16px", borderRadius:100, border:`1.5px solid ${postType===pt.key?C.primary:C.border}`, background:postType===pt.key?C.bgCard:"transparent", color:postType===pt.key?C.primary:C.textMuted, fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                      {pt.icon} {pt.label}
                    </button>
                  ))}
                </div>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  placeholder={postType==="question"?"What are you stuck on? Ask the community...":postType==="tip"?"Share a helpful tip or trick...":"Share your achievement! 🎉"}
                  onFocus={e => e.target.style.borderColor=C.primary} onBlur={e => e.target.style.borderColor=C.border}
                  style={{ width:"100%", height:90, padding:"13px", borderRadius:13, border:`1.5px solid ${C.border}`, fontFamily:F.body, fontSize:15, color:C.text, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.65 }} />
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:12 }}>
                  <button onClick={post}
                    style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"10px 24px", borderRadius:11, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
                    Post →
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {feed.map(item => {
                  const ts = POST_TYPES.find(p=>p.key===item.type) || POST_TYPES[0];
                  return (
                    <div key={item.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"20px 22px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                        <div style={{ width:40, height:40, borderRadius:"50%", background:C.secondary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:13, fontWeight:600, color:C.accent, flexShrink:0 }}>
                          {item.avatar}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:F.body, fontSize:15, fontWeight:700, color:C.secondary }}>{item.user}</div>
                          <div style={{ fontFamily:F.ui, fontSize:13, color:C.textMuted, fontWeight:500 }}>{item.college} · {item.time}</div>
                        </div>
                        <span style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:ts.color, color:ts.textColor }}>
                          {ts.icon} {ts.label}
                        </span>
                      </div>
                      <p style={{ fontFamily:F.body, fontSize:15, color:C.text, lineHeight:1.75, margin:"0 0 16px" }}>{item.text}</p>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <button onClick={() => toggleLike(item.id)}
                          style={{ fontFamily:F.ui, background:likedPosts[item.id]?C.bgCard:"transparent", border:`1px solid ${likedPosts[item.id]?C.borderDark:C.border}`, color:likedPosts[item.id]?C.primary:C.textMuted, padding:"6px 16px", borderRadius:20, fontSize:14, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                          {likedPosts[item.id]?"❤️":"🤍"} {item.likes}
                        </button>
                        <button style={{ fontFamily:F.ui, background:"transparent", border:"none", color:C.textMuted, fontSize:14, fontWeight:600, cursor:"pointer" }}>
                          💬 Reply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right sidebar */}
            <div>
              {/* Mini leaderboard */}
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"22px", marginBottom:16 }}>
                <h3 style={{ fontFamily:F.body, fontSize:17, fontWeight:700, color:C.secondary, marginBottom:18 }}>🏆 Top This Week</h3>
                {LEADERBOARD.slice(0,5).map(u => (
                  <div key={u.rank} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:u.rank<5?`1px solid ${C.border}`:"none" }}>
                    <span style={{ fontSize:16, width:26, textAlign:"center" }}>{RANK_MEDALS[u.rank]||`#${u.rank}`}</span>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:u.isYou?C.primary:C.secondary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:11, fontWeight:600, color:u.isYou?"#fff":C.accent, flexShrink:0 }}>{u.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:F.body, fontSize:14, fontWeight:u.isYou?700:500, color:u.isYou?C.primary:C.secondary }}>{u.name}</div>
                      <div style={{ fontFamily:F.mono, fontSize:12, color:C.textMuted }}>{u.score} pts</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setActiveTab("leaderboard")}
                  style={{ marginTop:14, width:"100%", fontFamily:F.ui, background:C.bgCard, border:"none", color:C.primary, padding:"10px", borderRadius:11, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  View Full Leaderboard →
                </button>
              </div>

              {/* Active rooms mini */}
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"22px" }}>
                <h3 style={{ fontFamily:F.body, fontSize:17, fontWeight:700, color:C.secondary, marginBottom:18 }}>🚪 Active Rooms</h3>
                {ROOMS.filter(r=>r.active).map(r => (
                  <div key={r.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <div>
                      <div style={{ fontFamily:F.body, fontSize:14, fontWeight:600, color:C.secondary }}>{r.name}</div>
                      <div style={{ fontFamily:F.ui, fontSize:13, color:C.textMuted, fontWeight:500 }}>{r.users} studying</div>
                    </div>
                    <button style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"6px 14px", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer" }}>Join</button>
                  </div>
                ))}
                <button onClick={() => setActiveTab("rooms")}
                  style={{ marginTop:6, width:"100%", fontFamily:F.ui, background:C.bgCard, border:"none", color:C.primary, padding:"10px", borderRadius:11, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  All Rooms →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {activeTab === "leaderboard" && (
          <div>
            {/* Podium */}
            <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:16, marginBottom:36 }}>
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((u, i) => {
                const heights = [190, 230, 165];
                const isFirst = i===1;
                return (
                  <div key={u.rank} style={{ textAlign:"center", width:148 }}>
                    <div style={{ fontSize:30, marginBottom:8 }}>{RANK_MEDALS[u.rank]}</div>
                    <div style={{ width:54, height:54, borderRadius:"50%", background:isFirst?C.primary:C.secondary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:16, fontWeight:600, color:isFirst?"#fff":C.accent, margin:"0 auto 10px" }}>{u.avatar}</div>
                    <div style={{ fontFamily:F.body, fontSize:14, fontWeight:700, color:C.secondary }}>{u.name}</div>
                    <div style={{ fontFamily:F.ui, fontSize:12, color:C.textMuted, marginBottom:10, fontWeight:500 }}>{u.college}</div>
                    <div style={{ height:heights[i], background:isFirst?C.primary:C.bgCard, borderRadius:"13px 13px 0 0", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:18, fontWeight:600, color:isFirst?"#fff":C.primary }}>
                      {u.score}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full table */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"54px 1fr 170px 90px 110px 100px", padding:"13px 22px", background:C.bgCard, borderBottom:`1px solid ${C.border}` }}>
                {["Rank","Student","College","Solved","Streak","Score"].map(h => (
                  <span key={h} style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
                ))}
              </div>
              {LEADERBOARD.map((u, i) => (
                <div key={u.rank} style={{ display:"grid", gridTemplateColumns:"54px 1fr 170px 90px 110px 100px", padding:"15px 22px", borderBottom:i<LEADERBOARD.length-1?`1px solid ${C.border}`:"none", background:u.isYou?C.bgCard:"transparent", alignItems:"center" }}>
                  <span style={{ fontSize:18 }}>{RANK_MEDALS[u.rank]||`#${u.rank}`}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:u.isYou?C.primary:C.secondary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:12, fontWeight:600, color:u.isYou?"#fff":C.accent, flexShrink:0 }}>{u.avatar}</div>
                    <div style={{ fontFamily:F.body, fontSize:15, fontWeight:u.isYou?700:500, color:u.isYou?C.primary:C.secondary }}>
                      {u.name} {u.isYou?"(You)":""}
                    </div>
                  </div>
                  <span style={{ fontFamily:F.ui, fontSize:13, color:C.textMuted, fontWeight:500 }}>{u.college}</span>
                  <span style={{ fontFamily:F.mono, fontSize:14, fontWeight:600, color:C.secondary }}>{u.solved}</span>
                  <span style={{ fontFamily:F.ui, fontSize:14, color:"#EA580C", fontWeight:700 }}>🔥 {u.streak}d</span>
                  <span style={{ fontFamily:F.mono, fontSize:16, fontWeight:600, color:C.primary }}>{u.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ROOMS ── */}
        {activeTab === "rooms" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:18 }}>
              {ROOMS.map(room => (
                <div key={room.name}
                  style={{ background:C.white, border:`1px solid ${joinedRooms[room.name]?C.borderDark:C.border}`, borderRadius:22, padding:"26px", transition:"all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                    <div style={{ width:48, height:48, background:C.bgCard, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                      {room.name.includes("DSA")?"💻":room.name.includes("Aptitude")?"🧮":room.name.includes("Mock")?"⏱️":"📚"}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:room.active?"#22C55E":"#94A3B8" }} />
                      <span style={{ fontFamily:F.ui, fontSize:13, color:room.active?"#15803D":"#94A3B8", fontWeight:700 }}>
                        {room.active?"Active":"Quiet"}
                      </span>
                    </div>
                  </div>
                  <h3 style={{ fontFamily:F.body, fontSize:18, fontWeight:700, color:C.secondary, marginBottom:5 }}>{room.name}</h3>
                  <p style={{ fontFamily:F.body, fontSize:14, color:C.textMuted, marginBottom:18, lineHeight:1.6 }}>{room.topic}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:500 }}>👥 {room.users} studying now</span>
                    <button onClick={() => setJoinedRooms(prev => ({ ...prev, [room.name]:!prev[room.name] }))}
                      style={{ fontFamily:F.ui, background:joinedRooms[room.name]?C.bgCard:C.primary, border:joinedRooms[room.name]?`1px solid ${C.borderDark}`:"none", color:joinedRooms[room.name]?C.primary:"#fff", padding:"9px 20px", borderRadius:11, fontSize:14, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}>
                      {joinedRooms[room.name]?"✓ Joined":"Join Room"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Create room */}
              <div style={{ background:"transparent", border:`2px dashed ${C.border}`, borderRadius:22, padding:"26px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", minHeight:220, transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderDark; e.currentTarget.style.background=C.bgCard; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background="transparent"; }}
              >
                <div style={{ fontFamily:F.mono, fontSize:36, color:C.borderDark, marginBottom:14 }}>+</div>
                <div style={{ fontFamily:F.body, fontSize:16, fontWeight:700, color:C.secondary, marginBottom:5 }}>Create a Room</div>
                <div style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, textAlign:"center", fontWeight:500 }}>Start a study room and invite your batchmates</div>
              </div>
            </div>

            {/* How rooms work */}
            <div style={{ marginTop:26, background:C.secondary, borderRadius:20, padding:"22px 30px", display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:48, height:48, background:"rgba(74,222,128,0.15)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🚪</div>
              <div>
                <div style={{ fontFamily:F.body, fontSize:16, fontWeight:700, color:"#fff", marginBottom:5 }}>How Study Rooms work</div>
                <div style={{ fontFamily:F.body, fontSize:15, color:"#86EFAC", lineHeight:1.7 }}>
                  Join a room to see each other's progress in real time — like a virtual library. No video, just presence, progress bars and shared chat.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}