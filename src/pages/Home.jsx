import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Study Buddy",
    desc: "Chat with an AI that knows your weak topics, past mistakes, and gives Socratic hints — never just dumps the answer.",
    color: "#a78bfa",
  },
  {
    icon: "📡",
    title: "Weak Topic Radar",
    desc: "After every problem, AI scores your understanding across 8 dimensions and builds a personal radar chart of your blind spots.",
    color: "#34d399",
  },
  {
    icon: "📅",
    title: "Adaptive Study Planner",
    desc: "Input your target company and exam date. Get a day-by-day plan that auto-adjusts every week based on your actual progress.",
    color: "#60a5fa",
  },
  {
    icon: "🏫",
    title: "College Leaderboard",
    desc: "Compete with your own batchmates — not global experts. See who's the topper in your college, not just worldwide.",
    color: "#f472b6",
  },
  {
    icon: "⚡",
    title: "Mood-Based Sessions",
    desc: "Check in your energy before studying. Get easier warm-ups when tired, harder problems when focused.",
    color: "#fbbf24",
  },
  {
    icon: "🎯",
    title: "Interview Readiness Score",
    desc: "A single 0–100 score updated daily. Share it on LinkedIn like a certification. Know exactly when you're ready.",
    color: "#f87171",
  },
];

const STATS = [
  { value: "500+", label: "DSA Problems" },
  { value: "20+", label: "Aptitude Topics" },
  { value: "AI", label: "Powered Hints" },
  { value: "Free", label: "Forever" },
];

export default function Home() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [visible, setVisible] = useState({});
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible((v) => ({ ...v, [i]: true }));
        },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div style={styles.root}>
      {/* Ambient glow that follows cursor */}
      <div
        style={{
          ...styles.cursorGlow,
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      {/* Grid background */}
      <div style={styles.grid} />

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <span style={styles.logoText}>
              Prep<span style={styles.logoAccent}>Buddy</span>
            </span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#stats" style={styles.navLink}>Stats</a>
            <button style={styles.navLoginBtn} onClick={() => navigate("/login")}>
              Login
            </button>
            <button style={styles.navSignupBtn} onClick={() => navigate("/signup")}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeDot} />
          AI-Powered DSA + Aptitude Prep
        </div>

        <h1 style={styles.heroTitle}>
          Stop Grinding.
          <br />
          <span style={styles.heroTitleAccent}>Start Mastering.</span>
        </h1>

        <p style={styles.heroDesc}>
          The only platform that knows your weak spots, adapts to your mood,
          <br />
          and competes you against your own college batch — not the whole world.
        </p>

        <div style={styles.heroBtns}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/signup")}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Start Free Today →
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/dsa")}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Explore Problems
          </button>
        </div>

        {/* Floating chips */}
        <div style={styles.chips}>
          {["Arrays", "Trees", "DP", "Graphs", "Sorting", "Aptitude", "Quant", "Verbal"].map((chip) => (
            <span key={chip} style={styles.chip}>{chip}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={styles.statsSection}>
        {STATS.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionLabel}>What makes us different</div>
        <h2 style={styles.sectionTitle}>
          Built for Indian college students.<br />
          <span style={styles.heroTitleAccent}>Not Silicon Valley engineers.</span>
        </h2>
        <p style={styles.sectionDesc}>
          Every feature is designed around one goal: get you placed, faster.
        </p>

        <div style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                ...styles.featureCard,
                borderColor: visible[i] ? f.color + "44" : "rgba(255,255,255,0.06)",
                transform: visible[i] ? "translateY(0)" : "translateY(30px)",
                opacity: visible[i] ? 1 : 0,
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = f.color + "88";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = f.color + "44";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ ...styles.featureIcon, background: f.color + "22", color: f.color }}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow} />
          <h2 style={styles.ctaTitle}>Ready to get placed?</h2>
          <p style={styles.ctaDesc}>
            Join thousands of students who stopped grinding randomly<br />
            and started preparing with purpose.
          </p>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/signup")}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.logoText}>
          Prep<span style={styles.logoAccent}>Buddy</span>
        </span>
        <span style={styles.footerText}>Built with ❤️ for Indian students</span>
      </footer>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#050508",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  cursorGlow: {
    position: "fixed",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
    transition: "left 0.1s, top 0.1s",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(5,5,8,0.8)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 22 },
  logoText: { fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
  logoAccent: { color: "#a78bfa" },
  navLinks: { display: "flex", alignItems: "center", gap: 8 },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: 14,
    padding: "6px 14px",
    borderRadius: 8,
    transition: "color 0.2s",
  },
  navLoginBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#e2e8f0",
    padding: "8px 18px",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },
  navSignupBtn: {
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    border: "none",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "100px 2rem 60px",
    maxWidth: 900,
    margin: "0 auto",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(139,92,246,0.12)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#c4b5fd",
    padding: "6px 16px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 32,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#a78bfa",
    boxShadow: "0 0 8px #a78bfa",
    display: "inline-block",
  },
  heroTitle: {
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#f1f5f9",
    marginBottom: 24,
    letterSpacing: "-0.02em",
  },
  heroTitleAccent: {
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroDesc: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    color: "#94a3b8",
    lineHeight: 1.7,
    marginBottom: 40,
  },
  heroBtns: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 48,
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    border: "none",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(124,58,237,0.4)",
    transition: "transform 0.2s",
  },
  secondaryBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#e2e8f0",
    padding: "14px 32px",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  chip: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8",
    padding: "5px 14px",
    borderRadius: 100,
    fontSize: 13,
  },
  statsSection: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    gap: 24,
    flexWrap: "wrap",
    padding: "40px 2rem",
    maxWidth: 900,
    margin: "0 auto",
  },
  statCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "24px 40px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  statValue: {
    fontSize: 36,
    fontWeight: 800,
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 4,
  },
  statLabel: { fontSize: 14, color: "#64748b", fontWeight: 500 },
  featuresSection: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "80px 2rem",
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#a78bfa",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1.2,
    marginBottom: 16,
    letterSpacing: "-0.02em",
  },
  sectionDesc: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 60,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
    textAlign: "left",
  },
  featureCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "28px",
    cursor: "default",
    transition: "all 0.3s ease",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 10,
  },
  featureDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 1.7,
  },
  ctaSection: {
    position: "relative",
    zIndex: 1,
    padding: "40px 2rem 80px",
    maxWidth: 800,
    margin: "0 auto",
    textAlign: "center",
  },
  ctaCard: {
    position: "relative",
    background: "rgba(124,58,237,0.08)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: 28,
    padding: "60px 40px",
    overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute",
    top: -100,
    left: "50%",
    transform: "translateX(-50%)",
    width: 400,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 16,
    letterSpacing: "-0.02em",
  },
  ctaDesc: {
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 1.7,
    marginBottom: 36,
  },
  footer: {
    position: "relative",
    zIndex: 1,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "24px 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1200,
    margin: "0 auto",
    flexWrap: "wrap",
    gap: 12,
  },
  footerText: { fontSize: 13, color: "#475569" },
};
