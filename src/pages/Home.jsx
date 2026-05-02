import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#16A34A",
  secondary: "#14532D",
  accent: "#4ADE80",
  bg: "#F0FDF4",
  bgCard: "#DCFCE7",
  bgDark: "#052E16",
  text: "#052E16",
  textMuted: "#166534",
  textLight: "#FFFFFF",
  border: "#BBF7D0",
  borderDark: "#86EFAC",
};

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Study Buddy",
    desc: "Chat with an AI that knows your weak topics and past mistakes. Get Socratic hints that guide you to the answer — never just hand it to you.",
  },
  {
    icon: "📡",
    title: "Weak Topic Radar",
    desc: "After every problem, AI scores your understanding across 8 dimensions and builds a personal radar showing exactly where you need work.",
  },
  {
    icon: "📅",
    title: "Adaptive Study Planner",
    desc: "Tell us your target company and exam date. Get a day-by-day plan that auto-adjusts every week based on what you actually completed.",
  },
  {
    icon: "🏫",
    title: "College Leaderboard",
    desc: "Compete with your own batchmates — not global experts. Feel like a topper in your own college, not lost in a sea of IITians.",
  },
  {
    icon: "⚡",
    title: "Mood-Based Sessions",
    desc: "Check in your energy before each session. Get easier warm-ups when tired, harder problems when you are in the zone.",
  },
  {
    icon: "🎯",
    title: "Interview Readiness Score",
    desc: "A single 0–100 score updated daily from your progress, streaks, and mock tests. Know exactly when you are ready to apply.",
  },
];

const STATS = [
  { value: "500+", label: "DSA Problems" },
  { value: "20+", label: "Aptitude Topics" },
  { value: "AI", label: "Powered Hints" },
  { value: "Free", label: "Always" },
];

const STEPS = [
  { num: "01", title: "Create your free account", desc: "Sign up in 30 seconds with your college email." },
  { num: "02", title: "Set your target and date", desc: "Tell us your dream company and placement exam date." },
  { num: "03", title: "Get your personal plan", desc: "AI builds a day-by-day study schedule just for you." },
  { num: "04", title: "Track and ace your placement", desc: "Study, improve, and watch your readiness score climb to 100." },
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
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible((v) => ({ ...v, [i]: true }));
        },
        { threshold: 0.12 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(240,253,244,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: COLORS.primary, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.secondary }}>
              Prep<span style={{ color: COLORS.primary }}>Buddy</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#features" style={{ color: COLORS.textMuted, textDecoration: "none", fontSize: 14, padding: "6px 14px", borderRadius: 8, fontWeight: 500 }}>Features</a>
            <a href="#how" style={{ color: COLORS.textMuted, textDecoration: "none", fontSize: 14, padding: "6px 14px", borderRadius: 8, fontWeight: 500 }}>How it works</a>
            <button
              onClick={() => navigate("/login")}
              style={{ background: "transparent", border: `1px solid ${COLORS.borderDark}`, color: COLORS.secondary, padding: "8px 18px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "8px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600, boxShadow: `0 4px 14px ${COLORS.primary}55` }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "90px 2rem 60px", textAlign: "center" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, color: COLORS.primary, padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.primary, display: "inline-block" }} />
          Free AI-Powered DSA + Aptitude Prep
        </div>

        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 800, lineHeight: 1.1, color: COLORS.secondary, marginBottom: 12, letterSpacing: "-0.02em" }}>
          Made for Students.
          <br />
          <span style={{ color: COLORS.primary }}>Built to Ace Placements.</span>
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: COLORS.textMuted, lineHeight: 1.8, maxWidth: 620, margin: "0 auto 16px" }}>
          Stop grinding blindly. PrepBuddy knows your weak spots, adapts to your mood, and gets you placement-ready — faster than any other platform.
        </p>

        <p style={{ fontSize: 14, color: COLORS.primary, fontWeight: 600, marginBottom: 40, letterSpacing: "0.02em" }}>
          🎓 Designed for every college student — not just IIT toppers.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
          <button
            onClick={() => navigate("/signup")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${COLORS.primary}44`, transition: "transform 0.2s" }}>
            Start Free Today →
          </button>
          <button
            onClick={() => navigate("/dsa")}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.bgCard; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            style={{ background: "transparent", border: `1.5px solid ${COLORS.borderDark}`, color: COLORS.secondary, padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
            Explore Problems
          </button>
        </div>

        {/* Topic chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {["Arrays", "Trees", "DP", "Graphs", "Recursion", "Sorting", "Quant", "Verbal", "Logical", "Mock Tests"].map(chip => (
            <span key={chip} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, padding: "5px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500 }}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: COLORS.secondary, padding: "48px 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: "1 1 160px", textAlign: "center", padding: "24px 32px", background: "rgba(255,255,255,0.07)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.accent, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "#86EFAC", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: COLORS.primary, textTransform: "uppercase", marginBottom: 14 }}>
          What makes us different
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: COLORS.secondary, lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.02em" }}>
          Every feature is built around<br />one goal — get you placed.
        </h2>
        <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 60 }}>
          No fluff. No distractions. Just what actually works.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, textAlign: "left" }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={el => cardRefs.current[i] = el}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderDark; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${COLORS.primary}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              style={{
                background: "#fff",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "28px",
                cursor: "default",
                transform: visible[i] ? "translateY(0)" : "translateY(24px)",
                opacity: visible[i] ? 1 : 0,
                transition: `all 0.4s ease ${i * 0.08}s`,
              }}>
              <div style={{ width: 44, height: 44, background: COLORS.bgCard, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.secondary, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: COLORS.bgCard, padding: "90px 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: COLORS.primary, textTransform: "uppercase", marginBottom: 14 }}>
            How it works
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: COLORS.secondary, marginBottom: 60, letterSpacing: "-0.02em" }}>
            From signup to placement — in 4 steps
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                ref={el => stepRefs.current[i] = el}
                style={{
                  background: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 20,
                  padding: "28px 20px",
                  textAlign: "left",
                  transform: visible[FEATURES.length + i] ? "translateY(0)" : "translateY(24px)",
                  opacity: visible[FEATURES.length + i] ? 1 : 0,
                  transition: `all 0.4s ease ${i * 0.1}s`,
                }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent, marginBottom: 12 }}>{s.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.secondary, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "90px 2rem" }}>
        <div style={{ background: COLORS.secondary, borderRadius: 28, padding: "64px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(74,222,128,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(74,222,128,0.08)", pointerEvents: "none" }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" }}>
            Start your journey today
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 16, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Your placement starts<br />with one smart decision.
          </h2>
          <p style={{ fontSize: 16, color: "#86EFAC", lineHeight: 1.7, marginBottom: 36 }}>
            Join students who stopped grinding randomly and<br />started preparing with purpose. It is completely free.
          </p>
          <button
            onClick={() => navigate("/signup")}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ background: COLORS.accent, border: "none", color: COLORS.secondary, padding: "15px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(74,222,128,0.3)", transition: "transform 0.2s" }}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "28px 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.secondary }}>
            Prep<span style={{ color: COLORS.primary }}>Buddy</span>
          </span>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>Made with ❤️ for every student aiming higher</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ fontSize: 13, color: COLORS.textMuted, textDecoration: "none" }}>About</a>
            <a href="#" style={{ fontSize: 13, color: COLORS.textMuted, textDecoration: "none" }}>Contact</a>
            <a href="#" style={{ fontSize: 13, color: COLORS.textMuted, textDecoration: "none" }}>GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}