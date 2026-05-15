import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { generateStudyPlan } from "../utils/gemini";

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

const COMPANIES = ["Google","Microsoft","Amazon","Meta","Apple","TCS","Infosys","Wipro","Cognizant","Accenture","Flipkart","Swiggy","Zomato","Paytm","CRED","Other"];
const WEAK_TOPICS = ["Arrays","Strings","Linked List","Trees","Graphs","DP","Recursion","Sorting","Binary Search","Stacks","Queues","Quant","Verbal","Logical Reasoning"];

const WEEKLY_PROGRESS = [
  { day:"Mon", value:3 },{ day:"Tue", value:5 },{ day:"Wed", value:2 },
  { day:"Thu", value:6 },{ day:"Fri", value:4 },{ day:"Sat", value:7 },{ day:"Sun", value:5 },
];

const FALLBACK_PLAN = [
  { day:"Day 1", topic:"Arrays — Two Pointer",       problems:3,  aptitude:"Number Series",     type:"dsa" },
  { day:"Day 2", topic:"Arrays — Sliding Window",    problems:3,  aptitude:"Percentage",         type:"dsa" },
  { day:"Day 3", topic:"Strings — Basics",           problems:3,  aptitude:"Ratio & Proportion", type:"dsa" },
  { day:"Day 4", topic:"Revision — Arrays + Strings",problems:2,  aptitude:"Speed & Distance",   type:"revision" },
  { day:"Day 5", topic:"Linked List — Basics",       problems:3,  aptitude:"Time & Work",        type:"dsa" },
  { day:"Day 6", topic:"Linked List — Advanced",     problems:3,  aptitude:"Profit & Loss",      type:"dsa" },
  { day:"Day 7", topic:"Mock Test — Week 1",         problems:10, aptitude:"Full Mock",           type:"mock" },
];

const TYPE_STYLE = {
  dsa:      { bg:C.bgCard,  color:C.primary,  label:"DSA" },
  aptitude: { bg:"#FEF9C3", color:"#854D0E",  label:"Aptitude" },
  revision: { bg:"#EDE9FE", color:"#6D28D9",  label:"Revision" },
  mock:     { bg:"#FEE2E2", color:"#991B1B",  label:"Mock Test" },
};

const INITIAL_TASKS = [
  { day:"Monday",    tasks:[
    { time:"9:00 AM",  task:"Arrays — Sliding Window",  type:"DSA",  done:true  },
    { time:"11:00 AM", task:"Aptitude — Time & Work",   type:"APT",  done:false },
    { time:"3:00 PM",  task:"Mock Test",                type:"MOCK", done:false },
  ]},
  { day:"Tuesday",   tasks:[
    { time:"10:00 AM", task:"Trees — Traversal",        type:"DSA",  done:false },
    { time:"2:00 PM",  task:"Number Series",            type:"APT",  done:false },
  ]},
  { day:"Wednesday", tasks:[
    { time:"10:00 AM", task:"Graphs — BFS/DFS",         type:"DSA",  done:false },
    { time:"2:00 PM",  task:"Profit & Loss",            type:"APT",  done:false },
    { time:"4:00 PM",  task:"Revision — Arrays",        type:"REV",  done:false },
  ]},
];

const TASK_TYPE_STYLE = {
  DSA:  { bg:C.bgCard,  color:C.primary  },
  APT:  { bg:"#FEF9C3", color:"#854D0E"  },
  MOCK: { bg:"#FEE2E2", color:"#991B1B"  },
  REV:  { bg:"#EDE9FE", color:"#6D28D9"  },
};

const NAV = [
  { icon:"🏠", label:"Dashboard",    path:"/dashboard" },
  { icon:"💻", label:"DSA Practice", path:"/dsa" },
  { icon:"🧮", label:"Aptitude",     path:"/aptitude" },
  { icon:"📅", label:"Study Planner",path:"/planner", active:true },
  { icon:"👥", label:"Community",    path:"/community" },
];

export default function Planner() {
  const navigate = useNavigate();
  const [view, setView]                   = useState("weekly");
  const [plan, setPlan]                   = useState(null);
  const [tasks, setTasks]                 = useState(INITIAL_TASKS);
  const [completedDays, setCompletedDays] = useState({});
  const [activeWeek, setActiveWeek]       = useState(0);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ company:"", examDate:"", dailyHours:"2", weakTopics:[] });

  const toggleTask = (di, ti) => {
    const u = [...tasks]; u[di].tasks[ti].done = !u[di].tasks[ti].done; setTasks(u);
  };
  const toggleWeakTopic = t => setForm(f => ({
    ...f, weakTopics: f.weakTopics.includes(t) ? f.weakTopics.filter(x=>x!==t) : [...f.weakTopics, t]
  }));
  const toggleDay = i => setCompletedDays(p => ({ ...p, [i]: !p[i] }));

  const totalTasks     = tasks.reduce((a,d) => a + d.tasks.length, 0);
  const completedTasks = tasks.reduce((a,d) => a + d.tasks.filter(t=>t.done).length, 0);
  const progress       = Math.round((completedTasks/totalTasks)*100);
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const weeks = plan ? Array.from({ length:Math.ceil(plan.length/7) }, (_,i) => plan.slice(i*7,i*7+7)) : [];

  const handleGenerate = async () => {
    if (!form.company)              { setError("Please select your target company."); return; }
    if (!form.examDate)             { setError("Please select your exam date.");      return; }
    if (form.weakTopics.length===0) { setError("Please select at least one weak topic."); return; }
    setLoading(true); setError("");
    try { const r = await generateStudyPlan(form.company, form.examDate, form.dailyHours, form.weakTopics); setPlan(r); }
    catch { setPlan(FALLBACK_PLAN); }
    setLoading(false); setShowForm(false); setView("aiplan");
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
      <main style={{ flex:1, padding:"30px 36px", overflowY:"auto" }}>

        {/* HEADER */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26, flexWrap:"wrap", gap:14 }}>
          <div>
            <h1 style={{ fontFamily:F.display, fontSize:"clamp(1.7rem, 2.5vw, 2.3rem)", fontWeight:700, color:C.secondary, marginBottom:6, letterSpacing:"-0.02em" }}>
              📅 Study Planner
            </h1>
            <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted }}>Your AI-powered personalized roadmap</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"11px 22px", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
            ✨ Generate AI Plan
          </button>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:4, marginBottom:26, background:C.white, borderRadius:12, padding:4, border:`1px solid ${C.border}`, width:"fit-content" }}>
          {[{ key:"weekly", label:"Weekly Tasks", icon:"📋" }, { key:"aiplan", label:"AI Plan", icon:"🤖" }].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)}
              style={{ padding:"10px 22px", borderRadius:9, border:"none", background:view===tab.key?C.primary:"transparent", color:view===tab.key?"#fff":C.textMuted, fontFamily:F.ui, fontSize:15, fontWeight:view===tab.key?800:600, cursor:"pointer", transition:"all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* FORM */}
        {showForm && (
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"26px", marginBottom:26 }}>
            <h3 style={{ fontFamily:F.body, fontSize:18, fontWeight:700, color:C.secondary, marginBottom:20 }}>✨ Generate Your AI Study Plan</h3>
            {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:11, padding:"12px 16px", marginBottom:16, fontFamily:F.ui, fontSize:15, color:"#DC2626", fontWeight:600 }}>⚠️ {error}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
              <div>
                <label style={{ display:"block", fontFamily:F.ui, fontSize:14, fontWeight:700, color:C.secondary, marginBottom:9 }}>Target Company</label>
                <select value={form.company} onChange={e => setForm(f=>({...f,company:e.target.value}))}
                  style={{ width:"100%", padding:"12px 16px", borderRadius:11, border:`1.5px solid ${C.border}`, background:C.bg, fontFamily:F.body, fontSize:15, color:C.text, outline:"none", cursor:"pointer" }}>
                  <option value="">Select company...</option>
                  {COMPANIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:"block", fontFamily:F.ui, fontSize:14, fontWeight:700, color:C.secondary, marginBottom:9 }}>Exam / Interview Date</label>
                <input type="date" value={form.examDate} onChange={e => setForm(f=>({...f,examDate:e.target.value}))}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width:"100%", padding:"12px 16px", borderRadius:11, border:`1.5px solid ${C.border}`, background:C.bg, fontFamily:F.body, fontSize:15, color:C.text, outline:"none", boxSizing:"border-box" }} />
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", fontFamily:F.ui, fontSize:14, fontWeight:700, color:C.secondary, marginBottom:9 }}>Daily Study Hours</label>
              <div style={{ display:"flex", gap:8 }}>
                {["1","2","3","4","5+"].map(h => (
                  <button key={h} onClick={() => setForm(f=>({...f,dailyHours:h}))}
                    style={{ flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${form.dailyHours===h?C.primary:C.border}`, background:form.dailyHours===h?C.primary:C.white, color:form.dailyHours===h?"#fff":C.textMuted, fontFamily:F.mono, fontSize:16, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:"block", fontFamily:F.ui, fontSize:14, fontWeight:700, color:C.secondary, marginBottom:9 }}>Weak Topics</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {WEAK_TOPICS.map(t => (
                  <button key={t} onClick={() => toggleWeakTopic(t)}
                    style={{ fontFamily:F.ui, padding:"7px 16px", borderRadius:100, border:`1.5px solid ${form.weakTopics.includes(t)?C.primary:C.border}`, background:form.weakTopics.includes(t)?C.bgCard:C.white, color:form.weakTopics.includes(t)?C.primary:C.textMuted, fontSize:14, fontWeight:form.weakTopics.includes(t)?700:500, cursor:"pointer", transition:"all 0.2s" }}>
                    {form.weakTopics.includes(t)?"✓ ":""}{t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleGenerate} disabled={loading}
                style={{ flex:1, padding:"13px", borderRadius:13, background:loading?C.borderDark:C.primary, border:"none", color:"#fff", fontFamily:F.ui, fontSize:16, fontWeight:800, cursor:loading?"not-allowed":"pointer" }}>
                {loading ? "🧠 Generating your plan..." : "✨ Generate Plan"}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding:"13px 22px", borderRadius:13, background:"transparent", border:`1.5px solid ${C.border}`, color:C.secondary, fontFamily:F.ui, fontSize:15, fontWeight:700, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* WEEKLY VIEW */}
        {view === "weekly" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))", gap:14, marginBottom:24 }}>
              {[
                { label:"Progress",      value:`${progress}%`,             icon:"📊", color:C.primary  },
                { label:"Completed",     value:`${completedTasks} tasks`,  icon:"✅", color:"#2563EB" },
                { label:"Remaining",     value:`${totalTasks-completedTasks} tasks`, icon:"⏳", color:"#EA580C" },
                { label:"Today's Tasks", value:tasks[0]?.tasks.length||0, icon:"📅", color:"#7C3AED" },
              ].map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:600 }}>{s.label}</span>
                    <span style={{ fontSize:20 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily:F.mono, fontSize:30, fontWeight:600, color:s.color, letterSpacing:"-0.02em" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 26px", marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontFamily:F.ui, fontSize:15, fontWeight:700, color:C.secondary }}>Weekly Progress</span>
                <span style={{ fontFamily:F.mono, fontSize:14, color:C.textMuted }}>{progress}% complete</span>
              </div>
              <div style={{ height:10, background:C.bgCard, borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius:100, transition:"width 0.5s" }} />
              </div>
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"22px 26px", marginBottom:24 }}>
              <h3 style={{ fontFamily:F.body, fontSize:18, fontWeight:700, color:C.secondary, marginBottom:4 }}>Weekly Activity</h3>
              <p style={{ fontFamily:F.body, fontSize:14, color:C.textMuted, marginBottom:16 }}>Problems solved per day</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={WEEKLY_PROGRESS}>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize:13, fill:C.textMuted, fontFamily:F.ui, fontWeight:600 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:13, fill:C.textMuted, fontFamily:F.ui }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, fontSize:14, fontFamily:F.ui }}/>
                  <Area type="monotone" dataKey="value" stroke={C.primary} strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill:C.primary, r:4 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {tasks.map((day, di) => (
              <div key={day.day} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"22px 26px", marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <h3 style={{ fontFamily:F.body, fontSize:18, fontWeight:700, color:C.secondary, margin:0 }}>{day.day}</h3>
                  <span style={{ fontFamily:F.mono, fontSize:13, color:C.textMuted }}>{day.tasks.filter(t=>t.done).length}/{day.tasks.length} done</span>
                </div>
                {day.tasks.map((task, ti) => (
                  <div key={ti} onClick={() => toggleTask(di, ti)}
                    style={{ display:"flex", alignItems:"center", gap:13, padding:"12px 16px", borderRadius:12, marginBottom:8, cursor:"pointer", background:task.done?C.bgCard:C.bg, opacity:task.done?0.7:1, transition:"all 0.2s" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", border:`2px solid ${task.done?C.primary:C.border}`, background:task.done?C.primary:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono, fontSize:13, color:"#fff", flexShrink:0, transition:"all 0.2s" }}>
                      {task.done?"✓":""}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:F.body, fontSize:15, fontWeight:600, color:C.secondary, textDecoration:task.done?"line-through":"none" }}>{task.task}</div>
                      <div style={{ fontFamily:F.mono, fontSize:12, color:C.textMuted, marginTop:2 }}>{task.time}</div>
                    </div>
                    <span style={{ fontFamily:F.ui, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:TASK_TYPE_STYLE[task.type]?.bg||C.bgCard, color:TASK_TYPE_STYLE[task.type]?.color||C.primary }}>
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
              <div style={{ background:C.white, border:`2px dashed ${C.border}`, borderRadius:20, padding:"64px 40px", textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:18 }}>🤖</div>
                <h3 style={{ fontFamily:F.display, fontSize:"clamp(1.4rem, 2.5vw, 2rem)", fontWeight:700, color:C.secondary, marginBottom:12, letterSpacing:"-0.02em" }}>No AI Plan Yet</h3>
                <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted, marginBottom:28 }}>Click Generate AI Plan to create your personalized study roadmap.</p>
                <button onClick={() => setShowForm(true)}
                  style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"13px 30px", borderRadius:13, fontSize:16, fontWeight:800, cursor:"pointer" }}>
                  ✨ Generate My Plan
                </button>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:12 }}>
                  <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted }}>
                    Targeting <strong style={{ color:C.secondary }}>{form.company}</strong> · <span style={{ fontFamily:F.mono }}>{form.dailyHours}</span> hrs/day · <span style={{ fontFamily:F.mono }}>{plan.length}</span> days
                  </p>
                  <div style={{ display:"flex", gap:10 }}>
                    {weeks.length>1 && weeks.map((_,i) => (
                      <button key={i} onClick={() => setActiveWeek(i)}
                        style={{ fontFamily:F.ui, padding:"7px 18px", borderRadius:100, border:`1.5px solid ${activeWeek===i?C.primary:C.border}`, background:activeWeek===i?C.primary:C.white, color:activeWeek===i?"#fff":C.textMuted, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                        Week {i+1}
                      </button>
                    ))}
                    <button onClick={() => setShowForm(true)}
                      style={{ fontFamily:F.ui, background:"transparent", border:`1.5px solid ${C.border}`, color:C.secondary, padding:"7px 18px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                      ✏️ Regenerate
                    </button>
                  </div>
                </div>

                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 26px", marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ fontFamily:F.ui, fontSize:15, fontWeight:700, color:C.secondary }}>Plan Completion</span>
                    <span style={{ fontFamily:F.mono, fontSize:14, color:C.textMuted }}>{completedCount}/{plan.length} days</span>
                  </div>
                  <div style={{ height:10, background:C.bgCard, borderRadius:100, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:plan.length?`${(completedCount/plan.length)*100}%`:"0%", background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius:100, transition:"width 0.4s" }} />
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:16 }}>
                  {(weeks[activeWeek]||plan).map((day, i) => {
                    const gi=activeWeek*7+i, done=completedDays[gi], ts=TYPE_STYLE[day.type]||TYPE_STYLE.dsa;
                    return (
                      <div key={i}
                        style={{ background:done?C.bgCard:C.white, border:`1.5px solid ${done?C.borderDark:C.border}`, borderRadius:18, padding:"22px", transition:"all 0.2s" }}
                        onMouseEnter={e => !done&&(e.currentTarget.style.transform="translateY(-3px)")}
                        onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                          <div>
                            <div style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{day.day}</div>
                            <div style={{ fontFamily:F.body, fontSize:15, fontWeight:700, color:done?C.textMuted:C.secondary, textDecoration:done?"line-through":"none" }}>{day.topic}</div>
                          </div>
                          <button onClick={() => toggleDay(gi)}
                            style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${done?C.primary:C.border}`, background:done?C.primary:"transparent", color:"#fff", fontFamily:F.mono, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                            {done?"✓":""}
                          </button>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:500 }}>Problems</span>
                            <span style={{ fontFamily:F.mono, fontSize:14, fontWeight:600, color:C.primary }}>{day.problems}</span>
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontFamily:F.ui, fontSize:14, color:C.textMuted, fontWeight:500 }}>Aptitude</span>
                            <span style={{ fontFamily:F.ui, fontSize:14, fontWeight:700, color:"#854D0E" }}>{day.aptitude}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontFamily:F.ui, fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:20, background:ts.bg, color:ts.color }}>{ts.label}</span>
                          {!done && <button onClick={() => navigate("/dsa")} style={{ fontFamily:F.ui, fontSize:13, fontWeight:700, color:C.primary, background:"none", border:"none", cursor:"pointer" }}>Start →</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* BANNER */}
        <div style={{ marginTop:28, background:C.secondary, borderRadius:20, padding:"22px 30px", display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>
          <div style={{ width:48, height:48, background:"rgba(74,222,128,0.15)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🧠</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:F.body, fontSize:16, fontWeight:700, color:"#fff", marginBottom:5 }}>AI Tip</div>
            <div style={{ fontFamily:F.body, fontSize:15, color:"#86EFAC" }}>Consistency beats intensity. Two focused hours daily beats eight hours on weekends. Mark each day done to build your streak!</div>
          </div>
        </div>

      </main>
    </div>
  );
}
