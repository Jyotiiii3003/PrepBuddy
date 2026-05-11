import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/supabase";

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

const COLLEGES = [
  "Select your college", "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Madras",
  "NIT Trichy", "NIT Warangal", "NIT Surathkal", "BITS Pilani", "VIT Vellore",
  "SRM Chennai", "Amity University", "Lovely Professional University",
  "Delhi University", "Mumbai University", "Pune University", "Other",
];

const COMPANIES = [
  "Select target company", "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant",
  "Accenture", "Capgemini", "Flipkart", "Swiggy", "Zomato", "Paytm", "CRED", "Other",
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
    if (signupErr) setError(signupErr.message || "Signup failed. Please try again.");
    else setSuccess(true);
  };

  if (success) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ width: 80, height: 80, background: C.bgCard, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 28px" }}>🎉</div>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, color: C.secondary, marginBottom: 14, letterSpacing: "-0.025em" }}>You are in!</h2>
        <p style={{ fontFamily: F.body, fontSize: 17, color: C.textMuted, lineHeight: 1.8, marginBottom: 36 }}>
          We sent a confirmation to <strong>{form.email}</strong>. Verify your email to start your placement journey.
        </p>
        <button onClick={() => navigate("/login")}
          style={{ fontFamily: F.ui, background: C.primary, border: "none", color: "#fff", padding: "14px 36px", borderRadius: 13, fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: `0 6px 22px ${C.primary}44` }}>
          Go to Login →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: F.body }}>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: C.secondary, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(74,222,128,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(74,222,128,0.06)" }} />

        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 60, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, background: C.accent, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚡</div>
          <span style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Prep<span style={{ color: C.accent }}>Buddy</span>
          </span>
        </div>

        <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.025em" }}>
          Your placement journey<br /><span style={{ color: C.accent }}>starts right here.</span>
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 17, color: "#86EFAC", lineHeight: 1.8, marginBottom: 52 }}>
          Join thousands of students preparing smarter — not harder.
        </p>

        {[
          { text: "Personalized AI study plan on day 1" },
          {  text: "Track your placement readiness score" },
          {  text: "Compete with your own college batch" },
          {  text: "AI hints that teach, not just answer" },
        ].map(item => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 40, height: 40, background: "rgba(74,222,128,0.12)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
            <span style={{ fontFamily: F.ui, fontSize: 16, color: "#bbf7d0", fontWeight: 600 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 2rem" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? C.primary : C.border, color: step >= s ? "#fff" : C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontSize: 14, fontWeight: 600, transition: "background 0.3s" }}>
                  {step > s ? "✓" : s}
                </div>
                <span style={{ fontFamily: F.ui, fontSize: 14, color: step >= s ? C.primary : C.textMuted, fontWeight: step >= s ? 700 : 500 }}>
                  {s === 1 ? "Your details" : "Your goals"}
                </span>
                {s < 2 && <div style={{ width: 36, height: 2, background: step > 1 ? C.primary : C.border, borderRadius: 2, transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>

          <h1 style={{ fontFamily: F.display, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: C.secondary, marginBottom: 10, letterSpacing: "-0.025em" }}>
            {step === 1 ? "Create your account" : "Set your goals"}
          </h1>
          <p style={{ fontFamily: F.body, fontSize: 16, color: C.textMuted, marginBottom: 32 }}>
            {step === 1 ? (
              <>Already have an account?{" "}
                <span onClick={() => navigate("/login")} style={{ color: C.primary, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
              </>
            ) : "This helps us personalize your study plan."}
          </p>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 18px", marginBottom: 22, fontFamily: F.ui, fontSize: 15, color: "#DC2626", fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Name */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 9 }}>Full name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma"
                  onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", fontFamily: F.body, fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 9 }}>Email address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu"
                  onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", fontFamily: F.body, fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 30 }}>
                <label style={{ display: "block", fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 9 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                    onKeyDown={e => e.key === "Enter" && handleNext()}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                    style={{ width: "100%", padding: "14px 50px 14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", fontFamily: F.body, fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button onClick={handleNext}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                style={{ width: "100%", padding: "15px", borderRadius: 13, background: C.primary, border: "none", color: "#fff", fontFamily: F.ui, fontSize: 17, fontWeight: 800, cursor: "pointer", transition: "transform 0.2s", boxShadow: `0 6px 22px ${C.primary}44` }}>
                Continue →
              </button>
            </>
          ) : (
            <>
              {/* College */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 9 }}>Your college</label>
                <select name="college" value={form.college} onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", fontFamily: F.body, fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box", cursor: "pointer" }}>
                  {COLLEGES.map(c => <option key={c} value={c === "Select your college" ? "" : c}>{c}</option>)}
                </select>
              </div>

              {/* Target company */}
              <div style={{ marginBottom: 30 }}>
                <label style={{ display: "block", fontFamily: F.ui, fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 9 }}>Target company</label>
                <select name="target" value={form.target} onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", fontFamily: F.body, fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box", cursor: "pointer" }}>
                  {COMPANIES.map(c => <option key={c} value={c === "Select target company" ? "" : c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setStep(1); setError(""); }}
                  style={{ flex: 1, padding: "15px", borderRadius: 13, background: "transparent", border: `1.5px solid ${C.borderDark}`, color: C.secondary, fontFamily: F.ui, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  style={{ flex: 2, padding: "15px", borderRadius: 13, background: loading ? "#86EFAC" : C.primary, border: "none", color: "#fff", fontFamily: F.ui, fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", transition: "transform 0.2s", boxShadow: `0 6px 22px ${C.primary}44` }}>
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
              </div>
            </>
          )}

          <p style={{ fontFamily: F.body, fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 26, lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
            <span style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}>Terms</span> and{" "}
            <span style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
