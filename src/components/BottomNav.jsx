import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const C = {
  primary: "#16A34A", secondary: "#14532D", accent: "#4ADE80",
  bg: "#F0FDF4", border: "#BBF7D0", white: "#FFFFFF",
}

const F = { ui: "'Nunito', sans-serif" }

const NAV = [
  { icon:"🏠", label:"Home",     path:"/dashboard" },
  { icon:"💻", label:"DSA",      path:"/dsa"       },
  { icon:"🧮", label:"Aptitude", path:"/aptitude"  },
  { icon:"📅", label:"Planner",  path:"/planner"   },
  { icon:"👥", label:"Community",path:"/community" },
]

export default function BottomNav() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()

  // Only show when logged in and on mobile
  if (!user) return null

  return (
    <nav style={{
      position:       "fixed",
      bottom:         0,
      left:           0,
      right:          0,
      background:     C.white,
      borderTop:      `1px solid ${C.border}`,
      display:        "flex",
      justifyContent: "space-around",
      alignItems:     "center",
      padding:        "8px 0 12px",
      zIndex:         200,
      // Only show on mobile
      display:        "none",
    }}
    className="mobile-bottom-nav"
    >
      {NAV.map(item => {
        const active = location.pathname === item.path
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ background:"transparent", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"4px 12px", borderRadius:10, background:active?C.bgCard:"transparent" }}>
            <span style={{ fontSize:20 }}>{item.icon}</span>
            <span style={{ fontFamily:F.ui, fontSize:10, fontWeight:active?700:500, color:active?C.primary:C.textMuted }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}