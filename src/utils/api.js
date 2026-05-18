const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Token helpers
export const getToken    = ()      => localStorage.getItem('prepbuddy_token')
export const setToken    = (token) => localStorage.setItem('prepbuddy_token', token)
export const clearToken  = ()      => localStorage.removeItem('prepbuddy_token')
export const getStoredUser  = ()      => JSON.parse(localStorage.getItem('prepbuddy_user') || 'null')
export const setStoredUser  = (user)  => localStorage.setItem('prepbuddy_user', JSON.stringify(user))
export const clearStoredUser = ()     => localStorage.removeItem('prepbuddy_user')

// Base fetch wrapper
async function api(endpoint, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// AUTH
export async function signup(name, email, password, college, targetCompany) {
  const data = await api('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, college, targetCompany }),
  })
  setToken(data.token)
  setStoredUser(data.user)
  return data
}

export async function login(email, password) {
  clearToken()        
  clearStoredUser()   
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  setStoredUser(data.user)
  return data
}


export async function logout() {
  clearToken()
  clearStoredUser()
}

export async function getMe() {
  return await api('/auth/me')
}

// PROGRESS
export async function getProgressStats() {
  return await api('/progress/stats')
}

export async function saveProblemProgress(problem, status) {
  return await api('/progress', {
    method: 'POST',
    body: JSON.stringify({
      problemId:    problem.id,
      problemTitle: problem.title,
      topic:        problem.topic,
      difficulty:   problem.difficulty,
      status,
    }),
  })
}

// USER
export async function getLeaderboard() {
  return await api('/user/leaderboard')
}

export async function updateProfile(updates) {
  return await api('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}