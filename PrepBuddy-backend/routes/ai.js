const express = require('express')
const protect = require('../middleware/auth')
const router  = express.Router()

router.use(protect)

async function callGroq(prompt) {
  console.log('🔵 Calling Groq...')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    })
  })

  const data = await res.json()
  console.log('📡 Groq status:', res.status)

  if (!res.ok) {
    console.error('❌ Groq error:', data)
    throw new Error(data.error?.message || 'AI request failed')
  }

  return data.choices[0].message.content
}

// POST /api/ai/hint
router.post('/hint', async (req, res) => {
  console.log('🟢 Hint route hit:', req.body)
  try {
    const { problemName, confusion, code } = req.body
    const hint = await callGroq(`
      You are a helpful DSA tutor. Student is solving: "${problemName}".
      Their confusion: "${confusion}"
      Their code: ${code || 'not written yet'}
      Give ONE Socratic guiding question to help them think.
      Do NOT give the answer directly.
      Keep it under 3 sentences. Be encouraging and friendly.
    `)
    console.log('✅ Hint success')
    res.json({ hint })
  } catch (err) {
    console.error('❌ Hint error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/study-plan
router.post('/study-plan', async (req, res) => {
  try {
    const { company, examDate, dailyHours, weakTopics } = req.body
    const raw = await callGroq(`
      Create a week-by-week DSA + Aptitude study plan.
      Target company: ${company}
      Exam date: ${examDate}
      Daily study hours: ${dailyHours}
      Weak topics: ${weakTopics}
      Return ONLY a valid JSON array like this:
      [{ "day": "Day 1", "topic": "Arrays", "problems": 3, "aptitude": "Number Series", "type": "dsa" }]
      No explanation, no markdown, no backticks. Just the raw JSON array.
    `)
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const plan = JSON.parse(cleaned)
    res.json({ plan })
  } catch (err) {
    console.error('❌ Study plan error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router