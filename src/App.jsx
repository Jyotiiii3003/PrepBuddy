import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DSA from './pages/DSA'
import Aptitude from './pages/Aptitude'
import Planner from './pages/Planner'
import Community from './pages/Community'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dsa"       element={<ProtectedRoute><DSA /></ProtectedRoute>} />
          <Route path="/aptitude"  element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
          <Route path="/planner"   element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App