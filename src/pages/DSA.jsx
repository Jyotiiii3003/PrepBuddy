import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { askGemini } from "../utils/gemini";
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

const TOPICS = ["All", "Arrays", "Strings", "Linked List", "Trees", "Graphs", "DP", "Recursion", "Sorting", "Binary Search", "Stacks", "Queues"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const STATUSES = ["All", "Solved", "Attempted", "Unsolved"];

const PROBLEMS = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", status: "solved", acceptance: "78%", companies: ["Google", "Amazon"] },
  { id: 2, title: "Best Time to Buy Stock", topic: "Arrays", difficulty: "Easy", status: "solved", acceptance: "72%", companies: ["Amazon"] },
  { id: 3, title: "Longest Substring Without Repeating", topic: "Strings", difficulty: "Medium", status: "attempted", acceptance: "55%", companies: ["Microsoft", "Google"] },
  { id: 4, title: "Binary Tree Inorder Traversal", topic: "Trees", difficulty: "Easy", status: "solved", acceptance: "80%", companies: ["Amazon"] },
  { id: 5, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", status: "unsolved", acceptance: "58%", companies: ["Google", "Meta"] },
  { id: 6, title: "Longest Common Subsequence", topic: "DP", difficulty: "Hard", status: "unsolved", acceptance: "42%", companies: ["Google"] },
  { id: 7, title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "Easy", status: "solved", acceptance: "75%", companies: ["Amazon", "Microsoft"] },
  { id: 8, title: "Valid Parentheses", topic: "Stacks", difficulty: "Easy", status: "solved", acceptance: "70%", companies: ["Google"] },
  { id: 9, title: "Climbing Stairs", topic: "DP", difficulty: "Easy", status: "attempted", acceptance: "65%", companies: ["Amazon"] },
  { id: 10, title: "Binary Search", topic: "Binary Search", difficulty: "Easy", status: "unsolved", acceptance: "60%", companies: ["Google", "Meta"] },
  { id: 11, title: "Maximum Subarray", topic: "Arrays", difficulty: "Medium", status: "solved", acceptance: "68%", companies: ["Amazon", "Microsoft"] },
  { id: 12, title: "Course Schedule", topic: "Graphs", difficulty: "Medium", status: "unsolved", acceptance: "48%", companies: ["Google", "Meta"] },
  { id: 13, title: "Word Break", topic: "DP", difficulty: "Medium", status: "unsolved", acceptance: "45%", companies: ["Google"] },
  { id: 14, title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", status: "solved", acceptance: "82%", companies: ["Amazon"] },
  { id: 15, title: "Trapping Rain Water", topic: "Arrays", difficulty: "Hard", status: "unsolved", acceptance: "38%", companies: ["Google", "Amazon", "Microsoft"] },
];

const DIFF_STYLE = {
  Easy: { bg: "#DCFCE7", color: "#15803D" },
  Medium: { bg: "#FEF9C3", color: "#854D0E" },
  Hard: { bg: "#FEE2E2", color: "#991B1B" },
};

const STATUS_ICON = {
  solved: "✅",
  attempted: "🔄",
  unsolved: "⭕",
};

const STARTER_CODE = {
  Arrays: `def solution(nums):
    # Your code here
    pass`,
  Strings: `def solution(s):
    # Your code here
    pass`,
  Trees: `def solution(root):
    # Your code here
    pass`,
  Graphs: `def solution(grid):
    # Your code here
    pass`,
  DP: `def solution(n):
    # Your code here
    pass`,
  default: `def solution():
    # Your code here
    pass`,
};

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
  const [showHintBox, setShowHintBox] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");

  const filtered = PROBLEMS.filter((p) => {
    const matchTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchDiff = selectedDiff === "All" || p.difficulty === selectedDiff;
    const matchStatus = selectedStatus === "All" || p.status === selectedStatus.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchDiff && matchStatus && matchSearch;
  });

  const openProblem = (p) => {
    setSelectedProblem(p);
    setCode(STARTER_CODE[p.topic] || STARTER_CODE.default);
    setHint("");
    setConfusion("");
    setShowHintBox(false);
    setActiveTab("problem");
  };

  const getHint = async () => {
    if (!confusion.trim()) {
      setHint("Please describe what you are confused about first.");
      return;
    }
    setHintLoading(true);
    setHint("");
    try {
      const result = await askGemini(`
        You are a helpful DSA tutor. The student is solving: "${selectedProblem.title}" (${selectedProblem.topic}, ${selectedProblem.difficulty}).
        Their confusion: "${confusion}"
        Their current code: ${code}
        Give ONE Socratic guiding question to help them think — do NOT give the answer directly.
        Keep it under 3 sentences. Be encouraging and friendly.
      `);
      setHint(result);
    } catch {
      setHint("Could not get hint. Please check your Gemini API key in the .env file.");
    }
    setHintLoading(false);
  };

  const solved = PROBLEMS.filter(p => p.status === "solved").length;
  const attempted = PROBLEMS.filter(p => p.status === "attempted").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: F.body }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: COLORS.secondary, display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div onClick={() => navigate("/")} style={{ padding: "0 16px 24px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Prep<span style={{ color: COLORS.accent }}>Buddy</span></span>
        </div>
        {[
          {  label: "Dashboard", path: "/dashboard" },
          {  label: "DSA Practice", path: "/dsa", active: true },
          {  label: "Aptitude", path: "/aptitude" },
          {  label: "Study Planner", path: "/planner" },
          {  label: "Community", path: "/community" },
        ].map((item) => (
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

      {/* PROBLEM LIST PANEL */}
      {!selectedProblem && (
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 6 }}>DSA Practice</h1>
            <p style={{ fontSize: 16, color: COLORS.textMuted }}>
              {solved} solved · {attempted} attempted · {PROBLEMS.length - solved - attempted} unsolved
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "18px 24px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.secondary }}>Overall Progress</span>
              <span style={{ fontSize: 14, color: COLORS.textMuted }}>{solved}/{PROBLEMS.length} solved</span>
            </div>
            <div style={{ height: 10, background: COLORS.bgCard, borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(solved / PROBLEMS.length) * 100}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 100, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              {[
                { label: "Easy", count: PROBLEMS.filter(p => p.difficulty === "Easy" && p.status === "solved").length, total: PROBLEMS.filter(p => p.difficulty === "Easy").length, color: "#15803D" },
                { label: "Medium", count: PROBLEMS.filter(p => p.difficulty === "Medium" && p.status === "solved").length, total: PROBLEMS.filter(p => p.difficulty === "Medium").length, color: "#854D0E" },
                { label: "Hard", count: PROBLEMS.filter(p => p.difficulty === "Hard" && p.status === "solved").length, total: PROBLEMS.filter(p => p.difficulty === "Hard").length, color: "#991B1B" },
              ].map(d => (
                <span key={d.label} style={{ fontSize: 14, color: d.color, fontWeight: 600 }}>{d.label}: {d.count}/{d.total}</span>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Search problems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.white, fontSize: 16, color: COLORS.text, outline: "none" }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
            <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.white, fontSize: 16, color: COLORS.text, outline: "none", fontFamily: F.ui, cursor: "pointer" }}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: COLORS.white, fontSize: 16, color: COLORS.text, outline: "none", cursor: "pointer" }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Topic Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setSelectedTopic(t)}
                style={{ padding: "6px 16px", borderRadius: 100, border: `1.5px solid ${selectedTopic === t ? COLORS.primary : COLORS.border}`, background: selectedTopic === t ? COLORS.primary : COLORS.white, color: selectedTopic === t ? "#fff" : COLORS.textMuted, fontSize: 14, fontWeight: 500, fontFamily: F.ui, cursor: "pointer", transition: "all 0.2s" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Problem Table */}
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 80px 120px", padding: "12px 20px", background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}` }}>
              {["#", "Title", "Topic", "Difficulty", "Status", "Companies"].map(h => (
                <span key={h} style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", color: COLORS.textMuted }}>
                No problems found. Try different filters.
              </div>
            ) : (
              filtered.map((p, i) => (
                <div key={p.id}
                  onClick={() => openProblem(p)}
                  style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 80px 120px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none", fontFamily: F.ui, cursor: "pointer", transition: "background 0.15s", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>{p.id}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.secondary }}>{p.title}</span>
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>{p.topic}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: DIFF_STYLE[p.difficulty].bg, color: DIFF_STYLE[p.difficulty].color, display: "inline-block", width: "fit-content" }}>{p.difficulty}</span>
                  <span style={{ fontSize: 16 }}>{STATUS_ICON[p.status]}</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {p.companies.slice(0, 2).map(c => (
                      <span key={c} style={{ fontSize: 10, background: COLORS.bgCard, color: COLORS.textMuted, padding: "2px 6px", borderRadius: 4 }}>{c}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      )}

      {/* PROBLEM DETAIL + CODE PANEL */}
      {selectedProblem && (
        <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left: Problem info */}
          <div style={{ width: "42%", borderRight: `1px solid ${COLORS.border}`, overflowY: "auto", padding: "24px" }}>
            <button onClick={() => setSelectedProblem(null)}
              style={{ background: COLORS.bgCard, border: "none", color: COLORS.secondary, padding: "7px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: F.ui, cursor: "pointer", marginBottom: 20 }}>
              ← Back to list
            </button>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20, background: COLORS.bg, borderRadius: 10, padding: 4 }}>
              {["problem", "hints", "solution"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: activeTab === tab ? COLORS.white : "transparent", color: activeTab === tab ? COLORS.secondary : COLORS.textMuted, fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none", textTransform: "capitalize" }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "problem" && (
              <>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.secondary, margin: 0 }}>{selectedProblem.title}</h2>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, padding: "3px 12px", borderRadius: 20, background: DIFF_STYLE[selectedProblem.difficulty].bg, color: DIFF_STYLE[selectedProblem.difficulty].color }}>{selectedProblem.difficulty}</span>
                  <span style={{ fontSize: 14, background: COLORS.bgCard, color: COLORS.textMuted, padding: "3px 12px", borderRadius: 20 }}>{selectedProblem.topic}</span>
                  <span style={{ fontSize: 14, background: COLORS.bgCard, color: COLORS.textMuted, padding: "3px 12px", borderRadius: 20 }}>Acceptance: {selectedProblem.acceptance}</span>
                </div>

                <div style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.8, marginBottom: 20 }}>
                  <p>Given the problem <strong>{selectedProblem.title}</strong>, implement an efficient solution.</p>
                  <p><strong>Example:</strong></p>
                  <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", fontFamily: "monospace", fontSize: 14, color: COLORS.secondary }}>
                    Input: nums = [2, 7, 11, 15], target = 9<br />
                    Output: [0, 1]<br />
                    Explanation: nums[0] + nums[1] = 9
                  </div>
                  <p style={{ marginTop: 16 }}><strong>Constraints:</strong></p>
                  <ul style={{ color: COLORS.textMuted, paddingLeft: 20 }}>
                    <li>2 ≤ nums.length ≤ 10⁴</li>
                    <li>−10⁹ ≤ nums[i] ≤ 10⁹</li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedProblem.companies.map(c => (
                    <span key={c} style={{ fontSize: 14, background: "#EFF6FF", color: "#1D4ED8", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>🏢 {c}</span>
                  ))}
                </div>
              </>
            )}

            {activeTab === "hints" && (
              <div>
                <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 20 }}>
                  Describe what you are stuck on and our AI tutor will give you a Socratic hint — a guiding question to help you think, not just the answer.
                </p>
                <textarea
                  value={confusion}
                  onChange={e => setConfusion(e.target.value)}
                  placeholder="e.g. I don't know how to handle duplicate elements, or I'm confused about the time complexity..."
                  style={{ width: "100%", height: 100, padding: "12px", borderRadius: 12, border: `1.5px solid ${COLORS.border}`, fontSize: 16, color: COLORS.text, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
                <button onClick={getHint} disabled={hintLoading}
                  style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 12, background: hintLoading ? COLORS.borderDark : COLORS.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: hintLoading ? "not-allowed" : "pointer" }}>
                  {hintLoading ? "Thinking..." : "🧠 Get AI Hint"}
                </button>
                {hint && (
                  <div style={{ marginTop: 16, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary, marginBottom: 8 }}>💡 AI HINT</div>
                    <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.7, margin: 0 }}>{hint}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "solution" && (
              <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 16, color: COLORS.textMuted }}>
                  Try solving the problem first! Once you have attempted it, the solution will be available here. Use the AI hints tab if you are stuck.
                </p>
                <button
                  onClick={() => setActiveTab("hints")}
                  style={{ marginTop: 12, background: COLORS.primary, border: "none", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 16, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                  Get a Hint Instead →
                </button>
              </div>
            )}
          </div>

          {/* Right: Code editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1E1E1E" }}>
            {/* Editor toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #2D2D2D" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#A0AEC0" }}>Language:</span>
                <select style={{ background: "#2D2D2D", color: "#E2E8F0", border: "1px solid #3D3D3D", padding: "4px 10px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>Java</option>
                  <option>C++</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setCode(STARTER_CODE[selectedProblem.topic] || STARTER_CODE.default)}
                  style={{ background: "#2D2D2D", border: "1px solid #3D3D3D", color: "#A0AEC0", padding: "6px 14px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
                  Reset
                </button>
                <button
                  style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "6px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: F.ui, cursor: "pointer" }}>
                  ▶ Run
                </button>
                <button
                  style={{ background: "#16A34A22", border: `1px solid ${COLORS.primary}`, color: COLORS.accent, padding: "6px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: F.ui, cursor: "pointer" }}>
                  Submit
                </button>
              </div>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{ flex: 1, background: "#1E1E1E", color: "#D4D4D4", border: "none", padding: "20px 24px", fontSize: 16, fontFamily: "'Fira Code', 'Courier New', monospace", lineHeight: 1.8, resize: "none", outline: "none" }}
            />

            {/* Output panel */}
            <div style={{ height: 120, borderTop: "1px solid #2D2D2D", padding: "12px 20px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#A0AEC0", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</div>
              <div style={{ fontSize: 14, color: "#4ADE80", fontFamily: "monospace" }}>
                Click Run to execute your code...
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
