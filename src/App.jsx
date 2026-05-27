import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DSA from './pages/DSA'
import Aptitude from './pages/Aptitude'
import Planner from './pages/Planner'
import Community from './pages/Community'
import NotFound from './pages/NotFound'

function AppRoutes() {
  const location = useLocation()
  const authPages = ['/', '/login', '/signup']
  const showBottomNav = !authPages.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dsa"       element={<ProtectedRoute><DSA /></ProtectedRoute>} />
        <Route path="/aptitude"  element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/planner"   element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App