const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`

export async function askGemini(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

export async function getDSAHint(problemName, userCode, confusion) {
  const prompt = `
    You are a helpful DSA tutor. Student is solving: "${problemName}".
    Their code: ${userCode}
    Their confusion: ${confusion}
    Give ONE Socratic guiding question only. Max 2 sentences. No direct answer.
  `
  return await askGemini(prompt)
}

export async function generateStudyPlan(company, examDate, dailyHours, weakTopics) {
  const prompt = `
    Create a week-by-week DSA + Aptitude study plan.
    Target: ${company}, Exam date: ${examDate}, Daily hours: ${dailyHours}
    Weak topics: ${weakTopics}
    Return ONLY a JSON array like:
    [{ "day": "Day 1", "topic": "Arrays", "problems": 3, "aptitude": "Number Series" }]
    No explanation, no markdown, just raw JSON array.
  `
  const raw = await askGemini(prompt)
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}