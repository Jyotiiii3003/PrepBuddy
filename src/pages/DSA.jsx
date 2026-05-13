import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { askGemini } from "../utils/gemini";

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

const TOPICS = ["All","Arrays","Strings","Linked List","Trees","Graphs","DP","Recursion","Sorting","Binary Search","Stacks","Queues"];
const DIFFICULTIES = ["All","Easy","Medium","Hard"];
const STATUSES = ["All","Solved","Attempted","Unsolved"];

const PROBLEMS = [
  { id:1, title:"Two Sum", topic:"Arrays", difficulty:"Easy", status:"solved", acceptance:"78%", companies:["Google","Amazon"] },
  { id:2, title:"Best Time to Buy Stock", topic:"Arrays", difficulty:"Easy", status:"solved", acceptance:"72%", companies:["Amazon"] },
  { id:3, title:"Longest Substring Without Repeating", topic:"Strings", difficulty:"Medium", status:"attempted", acceptance:"55%", companies:["Microsoft","Google"] },
  { id:4, title:"Binary Tree Inorder Traversal", topic:"Trees", difficulty:"Easy", status:"solved", acceptance:"80%", companies:["Amazon"] },
  { id:5, title:"Number of Islands", topic:"Graphs", difficulty:"Medium", status:"unsolved", acceptance:"58%", companies:["Google","Meta"] },
  { id:6, title:"Longest Common Subsequence", topic:"DP", difficulty:"Hard", status:"unsolved", acceptance:"42%", companies:["Google"] },
  { id:7, title:"Merge Two Sorted Lists", topic:"Linked List", difficulty:"Easy", status:"solved", acceptance:"75%", companies:["Amazon","Microsoft"] },
  { id:8, title:"Valid Parentheses", topic:"Stacks", difficulty:"Easy", status:"solved", acceptance:"70%", companies:["Google"] },
  { id:9, title:"Climbing Stairs", topic:"DP", difficulty:"Easy", status:"attempted", acceptance:"65%", companies:["Amazon"] },
  { id:10, title:"Binary Search", topic:"Binary Search", difficulty:"Easy", status:"unsolved", acceptance:"60%", companies:["Google","Meta"] },
  { id:11, title:"Maximum Subarray", topic:"Arrays", difficulty:"Medium", status:"solved", acceptance:"68%", companies:["Amazon","Microsoft"] },
  { id:12, title:"Course Schedule", topic:"Graphs", difficulty:"Medium", status:"unsolved", acceptance:"48%", companies:["Google","Meta"] },
  { id:13, title:"Word Break", topic:"DP", difficulty:"Medium", status:"unsolved", acceptance:"45%", companies:["Google"] },
  { id:14, title:"Reverse Linked List", topic:"Linked List", difficulty:"Easy", status:"solved", acceptance:"82%", companies:["Amazon"] },
  { id:15, title:"Trapping Rain Water", topic:"Arrays", difficulty:"Hard", status:"unsolved", acceptance:"38%", companies:["Google","Amazon","Microsoft"] },
];

const DIFF_STYLE = {
  Easy: { bg:"#DCFCE7", color:"#15803D" },
  Medium: { bg:"#FEF9C3", color:"#854D0E" },
  Hard: { bg:"#FEE2E2", color:"#991B1B" },
};

const STATUS_ICON = { solved:"✅", attempted:"🔄", unsolved:"⭕" };

const STARTER_CODE = {
  Arrays: `def solution(nums):\n    # Your code here\n    pass`,
  Strings: `def solution(s):\n    # Your code here\n    pass`,
  Trees: `def solution(root):\n    # Your code here\n    pass`,
  Graphs: `def solution(grid):\n    # Your code here\n    pass`,
  DP: `def solution(n):\n    # Your code here\n    pass`,
  default: `def solution():\n    # Your code here\n    pass`,
};

const NAV = [
  { icon:"🏠", label:"Dashboard", path:"/dashboard" },
  { icon:"💻", label:"DSA Practice", path:"/dsa", active:true },
  { icon:"🧮", label:"Aptitude", path:"/aptitude" },
  { icon:"📅", label:"Study Planner", path:"/planner" },
  { icon:"👥", label:"Community", path:"/community" },
];

export default function DSA() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDiff, setSelectedDiff] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [confusion, setConfusion] = useState("");
  const [activeTab, setActiveTab] = useState("problem");

  const filtered = PROBLEMS.filter(p => {
    const matchTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchDiff = selectedDiff === "All" || p.difficulty === selectedDiff;
    const matchStatus = selectedStatus === "All" || p.status === selectedStatus.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchDiff && matchStatus && matchSearch;
  });

  const openProblem = (p) => {
    setSelectedProblem(p);
    setCode(STARTER_CODE[p.topic] || STARTER_CODE.default);
    setHint(""); setConfusion(""); setActiveTab("problem");
  };

  const getHint = async () => {
    if (!confusion.trim()) { setHint("Please describe what you are confused about first."); return; }
    setHintLoading(true); setHint("");
    try {
      const result = await askGemini(`
        You are a helpful DSA tutor. Student is solving: "${selectedProblem.title}" (${selectedProblem.topic}, ${selectedProblem.difficulty}).
        Their confusion: "${confusion}"
        Their current code: ${code}
        Give ONE Socratic guiding question. Do NOT give the answer directly.
        Keep it under 3 sentences. Be encouraging and friendly.
      `);
      setHint(result);
    } catch { setHint("Could not get hint. Please check your Gemini API key in the .env file."); }
    setHintLoading(false);
  };

  const solved = PROBLEMS.filter(p => p.status === "solved").length;
  const attempted = PROBLEMS.filter(p => p.status === "attempted").length;

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

      {/* PROBLEM LIST */}
      {!selectedProblem && (
        <main style={{ flex:1, padding:"30px 36px", overflowY:"auto" }}>
          <div style={{ marginBottom:26 }}>
            <h1 style={{ fontFamily:F.display, fontSize:"clamp(1.7rem, 2.5vw, 2.3rem)", fontWeight:700, color:C.secondary, marginBottom:6, letterSpacing:"-0.02em" }}>DSA Practice 💻</h1>
            <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted }}>
              <span style={{ fontFamily:F.mono }}>{solved}</span> solved · <span style={{ fontFamily:F.mono }}>{attempted}</span> attempted · <span style={{ fontFamily:F.mono }}>{PROBLEMS.length - solved - attempted}</span> unsolved
            </p>
          </div>

          {/* Progress */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 26px", marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontFamily:F.ui, fontSize:15, fontWeight:700, color:C.secondary }}>Overall Progress</span>
              <span style={{ fontFamily:F.mono, fontSize:14, color:C.textMuted }}>{solved}/{PROBLEMS.length} solved</span>
            </div>
            <div style={{ height:10, background:C.bgCard, borderRadius:100, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(solved/PROBLEMS.length)*100}%`, background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius:100, transition:"width 0.5s" }} />
            </div>
            <div style={{ display:"flex", gap:22, marginTop:12 }}>
              {[
                { label:"Easy", count:PROBLEMS.filter(p=>p.difficulty==="Easy"&&p.status==="solved").length, total:PROBLEMS.filter(p=>p.difficulty==="Easy").length, color:"#15803D" },
                { label:"Medium", count:PROBLEMS.filter(p=>p.difficulty==="Medium"&&p.status==="solved").length, total:PROBLEMS.filter(p=>p.difficulty==="Medium").length, color:"#854D0E" },
                { label:"Hard", count:PROBLEMS.filter(p=>p.difficulty==="Hard"&&p.status==="solved").length, total:PROBLEMS.filter(p=>p.difficulty==="Hard").length, color:"#991B1B" },
              ].map(d => (
                <span key={d.label} style={{ fontFamily:F.ui, fontSize:13, color:d.color, fontWeight:700 }}>{d.label}: <span style={{ fontFamily:F.mono }}>{d.count}/{d.total}</span></span>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
            <input placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.borderColor=C.primary} onBlur={e => e.target.style.borderColor=C.border}
              style={{ flex:1, minWidth:200, padding:"11px 18px", borderRadius:11, border:`1.5px solid ${C.border}`, background:C.white, fontFamily:F.body, fontSize:15, color:C.text, outline:"none" }} />
            <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)}
              style={{ padding:"11px 16px", borderRadius:11, border:`1.5px solid ${C.border}`, background:C.white, fontFamily:F.ui, fontSize:14, fontWeight:600, color:C.text, outline:"none", cursor:"pointer" }}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding:"11px 16px", borderRadius:11, border:`1.5px solid ${C.border}`, background:C.white, fontFamily:F.ui, fontSize:14, fontWeight:600, color:C.text, outline:"none", cursor:"pointer" }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Topic Pills */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setSelectedTopic(t)}
                style={{ fontFamily:F.ui, padding:"7px 18px", borderRadius:100, border:`1.5px solid ${selectedTopic===t?C.primary:C.border}`, background:selectedTopic===t?C.primary:C.white, color:selectedTopic===t?"#fff":C.textMuted, fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"44px 1fr 130px 110px 88px 140px", padding:"13px 22px", background:C.bgCard, borderBottom:`1px solid ${C.border}` }}>
              {["#","Title","Topic","Difficulty","Status","Companies"].map(h => (
                <span key={h} style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding:"56px", textAlign:"center", fontFamily:F.body, fontSize:16, color:C.textMuted }}>No problems found. Try different filters.</div>
            ) : filtered.map((p,i) => (
              <div key={p.id} onClick={() => openProblem(p)}
                style={{ display:"grid", gridTemplateColumns:"44px 1fr 130px 110px 88px 140px", padding:"15px 22px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", cursor:"pointer", transition:"background 0.15s", alignItems:"center" }}
                onMouseEnter={e => e.currentTarget.style.background=C.bg}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <span style={{ fontFamily:F.mono, fontSize:13, color:C.textMuted }}>{p.id}</span>
                <span style={{ fontFamily:F.body, fontSize:15, fontWeight:600, color:C.secondary }}>{p.title}</span>
                <span style={{ fontFamily:F.ui, fontSize:13, color:C.textMuted, fontWeight:500 }}>{p.topic}</span>
                <span style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:20, background:DIFF_STYLE[p.difficulty].bg, color:DIFF_STYLE[p.difficulty].color, display:"inline-block", width:"fit-content" }}>{p.difficulty}</span>
                <span style={{ fontSize:17 }}>{STATUS_ICON[p.status]}</span>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {p.companies.slice(0,2).map(c => (
                    <span key={c} style={{ fontFamily:F.ui, fontSize:11, fontWeight:600, background:C.bgCard, color:C.textMuted, padding:"2px 8px", borderRadius:5 }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* PROBLEM DETAIL + CODE */}
      {selectedProblem && (
        <main style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Left */}
          <div style={{ width:"42%", borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:"26px" }}>
            <button onClick={() => setSelectedProblem(null)}
              style={{ fontFamily:F.ui, background:C.bgCard, border:"none", color:C.secondary, padding:"8px 16px", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:22 }}>
              ← Back to list
            </button>

            <div style={{ display:"flex", gap:4, marginBottom:22, background:C.bg, borderRadius:11, padding:4 }}>
              {["problem","hints","solution"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex:1, padding:"9px", borderRadius:9, border:"none", background:activeTab===tab?C.white:"transparent", color:activeTab===tab?C.secondary:C.textMuted, fontFamily:F.ui, fontSize:14, fontWeight:activeTab===tab?700:500, cursor:"pointer", boxShadow:activeTab===tab?"0 1px 4px rgba(0,0,0,0.08)":"none", textTransform:"capitalize" }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "problem" && (
              <>
                <h2 style={{ fontFamily:F.display, fontSize:"clamp(1.3rem, 2vw, 1.7rem)", fontWeight:700, color:C.secondary, marginBottom:14, letterSpacing:"-0.02em" }}>{selectedProblem.title}</h2>
                <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:F.ui, fontSize:13, fontWeight:700, padding:"4px 14px", borderRadius:20, background:DIFF_STYLE[selectedProblem.difficulty].bg, color:DIFF_STYLE[selectedProblem.difficulty].color }}>{selectedProblem.difficulty}</span>
                  <span style={{ fontFamily:F.ui, fontSize:13, fontWeight:600, background:C.bgCard, color:C.textMuted, padding:"4px 14px", borderRadius:20 }}>{selectedProblem.topic}</span>
                  <span style={{ fontFamily:F.ui, fontSize:13, fontWeight:600, background:C.bgCard, color:C.textMuted, padding:"4px 14px", borderRadius:20 }}>Acceptance: {selectedProblem.acceptance}</span>
                </div>
                <div style={{ fontFamily:F.body, fontSize:15, color:C.text, lineHeight:1.8, marginBottom:22 }}>
                  <p style={{ marginBottom:14 }}>Given the problem <strong>{selectedProblem.title}</strong>, implement an efficient solution.</p>
                  <p style={{ marginBottom:10, fontWeight:600 }}>Example:</p>
                  <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:11, padding:"14px 18px", fontFamily:F.mono, fontSize:14, color:C.secondary, lineHeight:1.8 }}>
                    Input: nums = [2, 7, 11, 15], target = 9<br/>Output: [0, 1]<br/>Explanation: nums[0] + nums[1] = 9
                  </div>
                  <p style={{ marginTop:18, marginBottom:10, fontWeight:600 }}>Constraints:</p>
                  <ul style={{ color:C.textMuted, paddingLeft:22, lineHeight:2 }}>
                    <li style={{ fontFamily:F.mono, fontSize:14 }}>2 ≤ nums.length ≤ 10⁴</li>
                    <li style={{ fontFamily:F.mono, fontSize:14 }}>−10⁹ ≤ nums[i] ≤ 10⁹</li>
                    <li style={{ fontFamily:F.body, fontSize:14 }}>Only one valid answer exists.</li>
                  </ul>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {selectedProblem.companies.map(c => (
                    <span key={c} style={{ fontFamily:F.ui, fontSize:13, fontWeight:600, background:"#EFF6FF", color:"#1D4ED8", padding:"5px 14px", borderRadius:20 }}>🏢 {c}</span>
                  ))}
                </div>
              </>
            )}

            {activeTab === "hints" && (
              <div>
                <h3 style={{ fontFamily:F.body, fontSize:17, fontWeight:700, color:C.secondary, marginBottom:8 }}>AI Hint Assistant 🧠</h3>
                <p style={{ fontFamily:F.body, fontSize:15, color:C.textMuted, marginBottom:20, lineHeight:1.7 }}>
                  Describe what you are stuck on and our AI tutor will give you a Socratic hint — a guiding question to help you think.
                </p>
                <textarea value={confusion} onChange={e => setConfusion(e.target.value)}
                  placeholder="e.g. I don't know how to handle duplicate elements..."
                  onFocus={e => e.target.style.borderColor=C.primary} onBlur={e => e.target.style.borderColor=C.border}
                  style={{ width:"100%", height:110, padding:"13px", borderRadius:13, border:`1.5px solid ${C.border}`, fontFamily:F.body, fontSize:15, color:C.text, resize:"vertical", outline:"none", boxSizing:"border-box" }} />
                <button onClick={getHint} disabled={hintLoading}
                  style={{ marginTop:12, width:"100%", padding:"13px", borderRadius:13, background:hintLoading?C.borderDark:C.primary, border:"none", color:"#fff", fontFamily:F.ui, fontSize:16, fontWeight:800, cursor:hintLoading?"not-allowed":"pointer" }}>
                  {hintLoading ? "Thinking..." : "🧠 Get AI Hint"}
                </button>
                {hint && (
                  <div style={{ marginTop:18, background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:13, padding:"18px" }}>
                    <div style={{ fontFamily:F.ui, fontSize:12, fontWeight:800, color:C.primary, marginBottom:10, letterSpacing:"0.08em" }}>💡 AI HINT</div>
                    <p style={{ fontFamily:F.body, fontSize:15, color:C.text, lineHeight:1.8 }}>{hint}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "solution" && (
              <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:13, padding:"20px" }}>
                <p style={{ fontFamily:F.body, fontSize:15, color:C.textMuted, lineHeight:1.7 }}>
                  Try solving the problem first! Once you have attempted it the solution will be available here.
                </p>
                <button onClick={() => setActiveTab("hints")}
                  style={{ marginTop:16, fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"11px 22px", borderRadius:11, fontSize:15, fontWeight:700, cursor:"pointer" }}>
                  Get a Hint Instead →
                </button>
              </div>
            )}
          </div>

          {/* Right: Code Editor */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#1a1a2e" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 22px", borderBottom:"1px solid #2D2D3D" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontFamily:F.ui, fontSize:14, color:"#A0AEC0", fontWeight:600 }}>Language:</span>
                <select style={{ background:"#2D2D3D", color:"#E2E8F0", border:"1px solid #3D3D4D", padding:"5px 12px", borderRadius:7, fontFamily:F.ui, fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  <option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:9 }}>
                <button onClick={() => setCode(STARTER_CODE[selectedProblem.topic] || STARTER_CODE.default)}
                  style={{ fontFamily:F.ui, background:"#2D2D3D", border:"1px solid #3D3D4D", color:"#A0AEC0", padding:"7px 16px", borderRadius:9, fontSize:14, fontWeight:600, cursor:"pointer" }}>Reset</button>
                <button style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"7px 22px", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer" }}>▶ Run</button>
                <button style={{ fontFamily:F.ui, background:"#16A34A22", border:`1px solid ${C.primary}`, color:C.accent, padding:"7px 22px", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer" }}>Submit</button>
              </div>
            </div>

            <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
              style={{ flex:1, background:"#1a1a2e", color:"#D4D4D4", border:"none", padding:"22px 26px", fontFamily:F.mono, fontSize:15, lineHeight:1.9, resize:"none", outline:"none" }} />

            <div style={{ height:130, borderTop:"1px solid #2D2D3D", padding:"14px 22px" }}>
              <div style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, color:"#A0AEC0", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Output</div>
              <div style={{ fontFamily:F.mono, fontSize:14, color:"#4ADE80" }}>Click Run to execute your code...</div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
