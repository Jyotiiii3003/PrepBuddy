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

// ── GET /api/progress/recent ─────────────────────────────
// Get last 5 problems attempted
router.get('/recent', async (req, res) => {
  try {
    const recent = await Progress.find({ userId: req.user._id })
      .sort({ solvedAt: -1 })
      .limit(5)
      .select('problemTitle topic difficulty status solvedAt')
    res.json({ recent })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/progress/weekly ─────────────────────────────
router.get('/weekly', async (req, res) => {
  try {
    const all = await Progress.find({
      userId: req.user._id,
      status: 'solved'
    })

    const weekly = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    all.forEach(p => {
      const date = p.solvedAt || p.createdAt
      if (!date) return

      const dayName = days[new Date(date).getDay()]
      if (weekly[dayName] !== undefined) {
        weekly[dayName] += 1
      }
    })

    const activity = [
      { day: 'Mon', problems: weekly.Mon },
      { day: 'Tue', problems: weekly.Tue },
      { day: 'Wed', problems: weekly.Wed },
      { day: 'Thu', problems: weekly.Thu },
      { day: 'Fri', problems: weekly.Fri },
      { day: 'Sat', problems: weekly.Sat },
      { day: 'Sun', problems: weekly.Sun },
    ]

    res.json({ activity })
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