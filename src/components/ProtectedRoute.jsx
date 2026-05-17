import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
        <div style={{ width:48, height:48, background:'#16A34A', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>⚡</div>
        <p style={{ fontFamily:"'Nunito', sans-serif", fontSize:16, color:'#14532D', fontWeight:600 }}>Loading PrepBuddy...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}