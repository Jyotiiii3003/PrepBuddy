const express = require('express')
const protect = require('../middleware/auth')
const router  = express.Router()

router.use(protect)

const geminiUrl = () =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

async function callGemini(prompt) {
  const res  = await fetch(geminiUrl(), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })
  const data = await res.json()
  if (res.status === 429) throw new Error('AI is busy — please wait a moment and try again.')
  if (!res.ok)            throw new Error(data.error?.message || 'AI request failed')
  return data.candidates[0].content.parts[0].text
}

// POST /api/ai/hint
router.post('/hint', async (req, res) => {
  console.log('🔵 Hint requested:', req.body)
  console.log('🔑 Key exists:', !!process.env.GEMINI_API_KEY)
  console.log('🔑 Key value:', process.env.GEMINI_API_KEY?.slice(0, 10))
  try {
    const { problemName, confusion, code } = req.body
    const hint = await callGemini(`
      You are a helpful DSA tutor. Student is solving: "${problemName}".
      Their confusion: "${confusion}"
      Their code: ${code || 'not written yet'}
      Give ONE Socratic guiding question. Do NOT give the answer directly.
      Keep it under 3 sentences. Be encouraging and friendly.
    `)
    console.log('✅ Hint generated successfully')
    res.json({ hint })
  } catch (err) {
    console.error('❌ Hint error:', err.message)
    res.status(500).json({ error: err.message })
  }
})
// POST /api/ai/study-plan
router.post('/study-plan', async (req, res) => {
  console.log('🔵 Study plan requested:', req.body)
  try {
    const { company, examDate, dailyHours, weakTopics } = req.body
    const raw = await callGemini(`
      Create a week-by-week DSA + Aptitude study plan.
      Target: ${company}, Exam date: ${examDate}, Daily hours: ${dailyHours}
      Weak topics: ${weakTopics}
      Return ONLY a JSON array like:
      [{ "day": "Day 1", "topic": "Arrays", "problems": 3, "aptitude": "Number Series" }]
      No explanation, no markdown, just raw JSON array.
    `)
    const plan = JSON.parse(raw.replace(/```json|```/g, '').trim())
    res.json({ plan })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router