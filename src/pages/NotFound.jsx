import { useNavigate } from "react-router-dom";

const F = {
  display: "'Clash Display', 'Sora', sans-serif",
  body:    "'Sora', 'Segoe UI', sans-serif",
  ui:      "'Nunito', 'Sora', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

const C = {
  primary:   "#16A34A", secondary: "#14532D", accent: "#4ADE80",
  bg:        "#F0FDF4", bgCard:    "#DCFCE7", text:   "#052E16",
  textMuted: "#166534", border:   "#BBF7D0", white:  "#FFFFFF",
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.body, padding:"2rem" }}>
      <div style={{ textAlign:"center", maxWidth:480 }}>

        {/* Logo */}
        <div onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:40, cursor:"pointer" }}>
          <div style={{ width:36, height:36, background:C.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <span style={{ fontFamily:F.display, fontSize:22, fontWeight:700, color:C.secondary, letterSpacing:"-0.02em" }}>
            Prep<span style={{ color:C.primary }}>Buddy</span>
          </span>
        </div>

        {/* 404 number */}
        <div style={{ fontFamily:F.mono, fontSize:"clamp(5rem, 15vw, 8rem)", fontWeight:600, color:C.primary, lineHeight:1, marginBottom:16, letterSpacing:"-0.04em" }}>
          404
        </div>

        {/* Message */}
        <h1 style={{ fontFamily:F.display, fontSize:"clamp(1.6rem, 3vw, 2.2rem)", fontWeight:700, color:C.secondary, marginBottom:14, letterSpacing:"-0.02em" }}>
          Page not found
        </h1>
        <p style={{ fontFamily:F.body, fontSize:16, color:C.textMuted, lineHeight:1.8, marginBottom:36 }}>
          Looks like you took a wrong turn. The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ fontFamily:F.ui, background:"transparent", border:`1.5px solid ${C.border}`, color:C.secondary, padding:"12px 24px", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            style={{ fontFamily:F.ui, background:C.primary, border:"none", color:"#fff", padding:"12px 28px", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:`0 4px 14px ${C.primary}44` }}>
            Go to Home →
          </button>
        </div>

        {/* Quick links */}
        <div style={{ marginTop:40, display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { label:"Dashboard", path:"/dashboard" },
            { label:"DSA Practice", path:"/dsa" },
            { label:"Aptitude", path:"/aptitude" },
            { label:"Planner", path:"/planner" },
          ].map(link => (
            <span key={link.path} onClick={() => navigate(link.path)}
              style={{ fontFamily:F.ui, fontSize:14, color:C.primary, fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>
              {link.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}