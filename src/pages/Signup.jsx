import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/supabase";
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
  success: "#15803D",
  successBg: "#F0FDF4",
};

const COLLEGES = [
  "Select your college",
  "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Madras",
  "NIT Trichy", "NIT Warangal", "NIT Surathkal",
  "BITS Pilani", "VIT Vellore", "SRM Chennai",
  "Amity University", "Lovely Professional University",
  "Delhi University", "Mumbai University", "Pune University",
  "Other",
];

const COMPANIES = [
  "Select target company",
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra",
  "Cognizant", "Accenture", "Capgemini",
  "Flipkart", "Swiggy", "Zomato", "Paytm", "CRED",
  "Other",
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", target: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const validateStep2 = () => {
    if (!form.college || form.college === "Select your college") return "Please select your college.";
    if (!form.target || form.target === "Select target company") return "Please select your target company.";
    return "";
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    const { error: signupErr } = await signUp(form.email, form.password, form.name, form.college);
    setLoading(false);
    if (signupErr) {
      setError(signupErr.message || "Signup failed. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ width: 72, height: 72, background: COLORS.bgCard, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>🎉</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 12 }}>You are in!</h2>
          <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
            We sent a confirmation email to <strong>{form.email}</strong>. Verify your email to activate your account and start your placement journey.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{ background: COLORS.primary, border: "none", color: "#fff", padding: "13px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: F.ui, cursor: "pointer", boxShadow: `0 6px 20px ${COLORS.primary}44` }}>
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

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
          Your placement journey<br />
          <span style={{ color: COLORS.accent }}>starts right here.</span>
        </h2>
        <p style={{ fontSize: 15, color: "#86EFAC", lineHeight: 1.7, marginBottom: 48 }}>
          Join thousands of students who are preparing smarter — not harder.
        </p>

        {[
          { icon: "🎯", text: "Personalized AI study plan on day 1" },
          { icon: "📊", text: "Track your placement readiness score" },
          { icon: "🏫", text: "Compete with your own college batch" },
          { icon: "💡", text: "AI hints that teach, not just answer" },
        ].map((item) => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? COLORS.primary : COLORS.border, color: step >= s ? "#fff" : COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, transition: "background 0.3s" }}>
                  {step > s ? "✓" : s}
                </div>
                <span style={{ fontSize: 14, color: step >= s ? COLORS.primary : COLORS.textMuted, fontWeight: step >= s ? 600 : 400 }}>
                  {s === 1 ? "Your details" : "Your goals"}
                </span>
                {s < 2 && <div style={{ width: 32, height: 2, background: step > 1 ? COLORS.primary : COLORS.border, borderRadius: 2, transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: F.display, color: COLORS.secondary, marginBottom: 8, letterSpacing: "-0.02em" }}>
            {step === 1 ? "Create your account" : "Set your goals"}
          </h1>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
            {step === 1 ? (
              <>Already have an account?{" "}
                <span onClick={() => navigate("/login")} style={{ color: COLORS.primary, fontWeight: 600, fontFamily: F.ui, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
              </>
            ) : "This helps us personalize your study plan."}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: COLORS.errorBg, border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 16, color: COLORS.error }}>
              ⚠️ {error}
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Priya Sharma"
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 15, color: COLORS.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Email address</label>
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
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    onKeyDown={e => e.key === "Enter" && handleNext()}
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

              <button
                onClick={handleNext}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                style={{ width: "100%", padding: "14px", borderRadius: 12, background: COLORS.primary, border: "none", color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: F.ui, cursor: "pointer", transition: "transform 0.2s", boxShadow: `0 6px 20px ${COLORS.primary}44` }}>
                Continue →
              </button>
            </>
          ) : (
            <>
              {/* College */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Your college</label>
                <select
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 15, color: form.college ? COLORS.text : COLORS.textMuted, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: F.ui, cursor: "pointer" }}>
                  {COLLEGES.map(c => <option key={c} value={c === "Select your college" ? "" : c}>{c}</option>)}
                </select>
              </div>

              {/* Target company */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Target company</label>
                <select
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 15, color: form.target ? COLORS.text : COLORS.textMuted, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: F.ui, cursor: "pointer" }}>
                  {COMPANIES.map(c => <option key={c} value={c === "Select target company" ? "" : c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  style={{ flex: 1, padding: "14px", borderRadius: 12, background: "transparent", border: `1.5px solid ${COLORS.borderDark}`, color: COLORS.secondary, fontSize: 15, fontWeight: 600, fontFamily: F.ui, cursor: "pointer" }}>
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  style={{ flex: 2, padding: "14px", borderRadius: 12, background: loading ? "#86EFAC" : COLORS.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "transform 0.2s", boxShadow: `0 6px 20px ${COLORS.primary}44` }}>
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
              </div>
            </>
          )}

          <p style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
            <span style={{ color: COLORS.primary, fontFamily: F.ui, cursor: "pointer" }}>Terms</span> and{" "}
            <span style={{ color: COLORS.primary, cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}