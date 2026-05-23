import { getToken } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function callBackend(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'AI request failed')
  return data
}

export async function askGemini(prompt, problemName = '', confusion = '', code = '') {
  const data = await callBackend('/ai/hint', { problemName, confusion, code, prompt })
  return data.hint
}

export async function getDSAHint(problemName, confusion, code) {
  const data = await callBackend('/ai/hint', { problemName, confusion, code })
  return data.hint
}

export async function generateStudyPlan(company, examDate, dailyHours, weakTopics) {
  const data = await callBackend('/ai/study-plan', { company, examDate, dailyHours, weakTopics })
  return data.plan
}