const express  = require('express')
const Progress = require('../models/Progress')
const Streak   = require('../models/Streak')
const protect  = require('../middleware/auth')
const router   = express.Router()

router.use(protect)

// ── GET /api/progress ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .sort({ solvedAt: -1 })
    res.json({ progress })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/progress/stats ──────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const all       = await Progress.find({ userId: req.user._id })
    const solved    = all.filter(p => p.status === 'solved').length
    const attempted = all.filter(p => p.status === 'attempted').length

    // Topic breakdown for radar chart
    const topics = {}
    all.forEach(p => {
      if (!topics[p.topic]) topics[p.topic] = { solved: 0, total: 0 }
      topics[p.topic].total++
      if (p.status === 'solved') topics[p.topic].solved++
    })

    // Calculate streak
    const streaks = await Streak.find({ userId: req.user._id })
      .sort({ date: -1 })

    let streakCount = 0
    const today = new Date().toISOString().split('T')[0]
    const todayDate = new Date(today)
    for (let i = 0; i < streaks.length; i++) {
      const d    = new Date(streaks[i].date)
      const diff = Math.floor((todayDate - d) / (1000 * 60 * 60 * 24))
      if (diff === i) streakCount++
      else break
    }

    res.json({ solved, attempted, total: all.length, topics, streak: streakCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/progress ───────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { problemId, problemTitle, topic, difficulty, status } = req.body

    const existing = await Progress.findOne({
      userId: req.user._id,
      problemId,
    })

    let progress
    if (existing) {
      existing.status   = status
      existing.solvedAt = new Date()
      progress = await existing.save()
    } else {
      progress = await Progress.create({
        userId: req.user._id,
        problemId,
        problemTitle,
        topic,
        difficulty,
        status,
      })
    }

    // Update streak if solved
    if (status === 'solved') {
      const today  = new Date().toISOString().split('T')[0]
      const streak = await Streak.findOne({ userId: req.user._id, date: today })
      if (streak) {
        streak.problemsSolved++
        await streak.save()
      } else {
        await Streak.create({
          userId: req.user._id,
          date: today,
          problemsSolved: 1,
        })
      }
    }

    res.json({ progress })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router