import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, getStoredUser, clearToken, clearStoredUser, getMe } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      getMe()
        .then(data => { setUser(data.user); setLoading(false) })
        .catch(() => { clearToken(); clearStoredUser(); setUser(null); setLoading(false) })
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    clearToken()
    clearStoredUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}