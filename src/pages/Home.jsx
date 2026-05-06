import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const F = {
  display: "'Clash Display', 'Sora', sans-serif",
  body: "'Sora', 'Segoe UI', sans-serif",
  ui: "'Nunito', 'Sora', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
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

const FEATURES = [
  { icon: "🧠", title: "AI Study Buddy", desc: "Chat with an AI that knows your weak topics and past mistakes. Get Socratic hints that guide you — never just hand you the answer." },
  { icon: "📡", title: "Weak Topic Radar", desc: "After every problem, AI scores your understanding across 8 dimensions and builds a personal radar showing exactly where you need work." },
  { icon: "📅", title: "Adaptive Planner", desc: "Tell us your target company and exam date. Get a day-by-day plan that auto-adjusts every week based on what you completed." },
  { icon: "🏫", title: "College Leaderboard", desc: "Compete with your own batchmates — not global experts. Feel like a topper in your own college." },
  { icon: "⚡", title: "Mood-Based Sessions", desc: "Check in your energy before each session. Get easier warm-ups when tired, harder problems when you're in the zone." },
  { icon: "🎯", title: "Readiness Score", desc: "A single 0–100 score updated daily from your progress, streaks and mock tests. Know exactly when you are ready." },
];

const STATS = [
  { value: "500+", label: "DSA Problems" },
  { value: "20+", label: "Aptitude Topics" },
  { value: "AI", label: "Powered Hints" },
  { value: "Free", label: "Always" },
];

const STEPS = [
  { num: "01", title: "Create your free account", desc: "Sign up in 30 seconds with your college email." },
  { num: "02", title: "Set your target & date", desc: "Tell us your dream company and placement exam date." },
  { num: "03", title: "Get your personal plan", desc: "AI builds a day-by-day study schedule just for you." },
  { num: "04", title: "Track & ace placement", desc: "Study, improve, and watch your readiness score hit 100." },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  const cardRefs = useRef([]);
  const stepRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const allRefs = [...cardRefs.current, ...stepRefs.current];
    const observers = allRefs.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisible(v => ({ ...v, [i]: true }));
      }, { threshold: 0.12 });
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.body, minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(240,253,244,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: C.primary, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚡</div>
            <span style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: C.secondary, letterSpacing: "-0.02em" }}>
              Prep<span style={{ color: C.primary }}>Buddy</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href="#features" style={{ fontFamily: F.ui, color: C.textMuted, textDecoration: "none", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>Features</a>
            <a href="#how" style={{ fontFamily: F.ui, color: C.textMuted, textDecoration: "none", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>How it works</a>
            <button onClick={() => navigate("/login")}
              style={{ fontFamily: F.ui, background: "transparent", border: `1.5px solid ${C.borderDark}`, color: C.secondary, padding: "9px 20px", borderRadius: 10, fontSize: 15, cursor: "pointer", fontWeight: 700 }}>
              Login
            </button>
            <button onClick={() => navigate("/signup")}
              style={{ fontFamily: F.ui, background: C.primary, border: "none", color: "#fff", padding: "9px 22px", borderRadius: 10, fontSize: 15, cursor: "pointer", fontWeight: 700, boxShadow: `0 4px 14px ${C.primary}55` }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "100px 2rem 70px", textAlign: "center" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.bgCard, border: `1px solid ${C.border}`, color: C.primary, padding: "7px 18px", borderRadius: 100, fontSize: 14, fontFamily: F.ui, fontWeight: 700, marginBottom: 36 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.primary, display: "inline-block" }} />
          Free AI-Powered DSA + Aptitude Prep
        </div>

        <h1 style={{ fontFamily: F.display, fontSize: "clamp(3rem, 7vw, 5.2rem)", fontWeight: 700, lineHeight: 1.06, color: C.secondary, marginBottom: 16, letterSpacing: "-0.03em" }}>
          Made for Students.
          <br />
          <span style={{ color: C.primary }}>Built to Ace Placements.</span>
        </h1>

        <p style={{ fontFamily: F.body, fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)", color: C.textMuted, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 18px", fontWeight: 400 }}>
          Stop grinding blindly. PrepBuddy knows your weak spots, adapts to your mood, and gets you placement-ready faster than any other platform.
        </p>

        <p style={{ fontFamily: F.ui, fontSize: 15, color: C.primary, fontWeight: 700, marginBottom: 44, letterSpacing: "0.01em" }}>
          🎓 Designed for every college student — not just IIT toppers.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <button onClick={() => navigate("/signup")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ fontFamily: F.ui, background: C.primary, border: "none", color: "#fff", padding: "15px 36px", borderRadius: 13, fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 28px ${C.primary}44`, transition: "transform 0.2s" }}>
            Start Free Today →
          </button>
          <button onClick={() => navigate("/dsa")}
            onMouseEnter={e => { e.currentTarget.style.background = C.bgCard; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            style={{ fontFamily: F.ui, background: "transparent", border: `1.5px solid ${C.borderDark}`, color: C.secondary, padding: "15px 36px", borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
            Explore Problems
          </button>
        </div>

        {/* Topic chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {["Arrays", "Trees", "DP", "Graphs", "Recursion", "Sorting", "Quant", "Verbal", "Logical", "Mock Tests"].map(chip => (
            <span key={chip} style={{ fontFamily: F.ui, background: C.bgCard, border: `1px solid ${C.border}`, color: C.textMuted, padding: "6px 16px", borderRadius: 100, fontSize: 14, fontWeight: 600 }}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.secondary, padding: "52px 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: "1 1 160px", textAlign: "center", padding: "26px 36px", background: "rgba(255,255,255,0.07)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontFamily: F.mono, fontSize: 40, fontWeight: 600, color: C.accent, marginBottom: 6, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontFamily: F.ui, fontSize: 14, color: "#86EFAC", fontWeight: 700, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.primary, textTransform: "uppercase", marginBottom: 16 }}>
          What makes us different
        </p>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 700, color: C.secondary, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.025em" }}>
          Every feature is built around<br />one goal — get you placed.
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 17, color: C.textMuted, marginBottom: 68 }}>
          No fluff. No distractions. Just what actually works.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22, textAlign: "left" }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} ref={el => cardRefs.current[i] = el}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderDark; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${C.primary}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "30px", cursor: "default", transform: visible[i] ? "translateY(0)" : "translateY(28px)", opacity: visible[i] ? 1 : 0, transition: `all 0.45s ease ${i * 0.08}s` }}>
              <div style={{ width: 48, height: 48, background: C.bgCard, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.secondary, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontFamily: F.body, fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: C.bgCard, padding: "96px 2rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.primary, textTransform: "uppercase", marginBottom: 16 }}>
            How it works
          </p>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 700, color: C.secondary, marginBottom: 64, letterSpacing: "-0.025em" }}>
            From signup to placement — in 4 steps
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} ref={el => stepRefs.current[i] = el}
                style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, padding: "30px 22px", textAlign: "left", transform: visible[FEATURES.length + i] ? "translateY(0)" : "translateY(28px)", opacity: visible[FEATURES.length + i] ? 1 : 0, transition: `all 0.45s ease ${i * 0.1}s` }}>
                <div style={{ fontFamily: F.mono, fontSize: 32, fontWeight: 600, color: C.accent, marginBottom: 14, letterSpacing: "-0.02em" }}>{s.num}</div>
                <h3 style={{ fontFamily: F.body, fontSize: 17, fontWeight: 700, color: C.secondary, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "96px 2rem" }}>
        <div style={{ background: C.secondary, borderRadius: 30, padding: "68px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -70, right: -70, width: 220, height: 220, borderRadius: "50%", background: "rgba(74,222,128,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(74,222,128,0.07)", pointerEvents: "none" }} />

          <p style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
            Start your journey today
          </p>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4.5vw, 2.8rem)", fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
            Your placement starts<br />with one smart decision.
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 16, color: "#86EFAC", lineHeight: 1.8, marginBottom: 40 }}>
            Join students who stopped grinding randomly and<br />started preparing with purpose. It is completely free.
          </p>
          <button onClick={() => navigate("/signup")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ fontFamily: F.ui, background: C.accent, border: "none", color: C.secondary, padding: "16px 40px", borderRadius: 13, fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(74,222,128,0.3)", transition: "transform 0.2s" }}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "30px 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <span style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: C.secondary, letterSpacing: "-0.02em" }}>
            Prep<span style={{ color: C.primary }}>Buddy</span>
          </span>
          <span style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted }}>Made with ❤️ for every student aiming higher</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["About", "Contact", "GitHub"].map(link => (
              <a key={link} href="#" style={{ fontFamily: F.ui, fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 600 }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
