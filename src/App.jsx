import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DSA from './pages/DSA'
import Planner from './pages/Planner'
import Community from './pages/Community'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dsa" element={<DSA />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App