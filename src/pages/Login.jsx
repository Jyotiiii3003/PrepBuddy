import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { useAuth } from "../context/AuthContext";
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
  error: "#DC2626",
  errorBg: "#FEF2F2",
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const { setUser } = useAuth();

  const handleSubmit = async () => {
  if (!form.email || !form.password) {
    setError("Please fill in all fields.");
    return;
  }
  setLoading(true);
  try {
    const data = await login(form.email, form.password);
    setUser(data.user);
    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  }
  setLoading(false);
};

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", fontFamily: F.body }}>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: COLORS.secondary, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(74,222,128,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(74,222,128,0.06)" }} />

        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 56, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, background: COLORS.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 32, fontWeight: 700, fontFamily: F.mono, color: "#fff" }}>
            Prep<span style={{ color: COLORS.accent }}>Buddy</span>
          </span>
        </div>

        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.02em" }}>
          Welcome back!<br />
          <span style={{ color: COLORS.accent }}>Let's keep going.</span>
        </h2>
        <p style={{ fontSize: 15, color: "#86EFAC", lineHeight: 1.7, marginBottom: 48 }}>
          Your study streak, progress, and personalized plan are waiting for you.
        </p>

        {/* Feature highlights */}
        {[
          { icon: "📡", text: "Your weak topic radar is updated" },
          { icon: "📅", text: "Your study plan is ready for today" },
          { icon: "🏆", text: "Check your college leaderboard rank" },
        ].map((item) => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, background: "rgba(74,222,128,0.12)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 16, color: "#bbf7d0" }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 2rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 8, letterSpacing: "-0.02em" }}>
            Sign in
          </h1>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 36 }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: COLORS.primary, fontWeight: 600, fontFamily: F.ui, cursor: "pointer", textDecoration: "underline" }}>
              Create one free
            </span>
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: COLORS.errorBg, border: `1px solid #FECACA`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 16, color: COLORS.error }}>
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 15, color: COLORS.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                onFocus={e => e.target.style.borderColor = COLORS.primary}
                onBlur={e => e.target.style.borderColor = COLORS.border}
                style={{ width: "100%", padding: "12px 48px 12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 15, color: COLORS.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontFamily: F.ui, cursor: "pointer", fontSize: 16, color: COLORS.textMuted }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 28 }}>
            <span style={{ fontSize: 14, color: COLORS.primary, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            style={{ width: "100%", padding: "14px", borderRadius: 12, background: loading ? "#86EFAC" : COLORS.primary, border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "transform 0.2s", boxShadow: `0 6px 20px ${COLORS.primary}44` }}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            <span style={{ fontSize: 14, color: COLORS.textMuted }}>or</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          </div>

          {/* Google */}
          <button
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bgCard}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#fff", border: `1.5px solid ${COLORS.border}`, color: COLORS.secondary, fontSize: 15, fontWeight: 600, fontFamily: F.ui, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" }}>
            <span style={{ fontSize: 18 }}>🔵</span>
            Continue with Google
          </button>

          <p style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginTop: 28, lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <span style={{ color: COLORS.primary, cursor: "pointer" }}>Terms</span> and{" "}
            <span style={{ color: COLORS.primary, cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}