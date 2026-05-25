const express       = require('express')
const AptitudeScore = require('../models/AptitudeScore')
const protect       = require('../middleware/auth')
const router        = express.Router()

router.use(protect)

// ── POST /api/aptitude/score ─────────────────────────────
// Save quiz result
router.post('/score', async (req, res) => {
  try {
    const { topic, score, total } = req.body
    const percentage = Math.round((score / total) * 100)

    const saved = await AptitudeScore.create({
      userId: req.user._id,
      topic,
      score,
      total,
      percentage,
    })

    res.status(201).json({ saved })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/aptitude/scores ─────────────────────────────
// Get all scores for logged in user
router.get('/scores', async (req, res) => {
  try {
    const scores = await AptitudeScore.find({ userId: req.user._id })
      .sort({ takenAt: -1 })
    res.json({ scores })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/aptitude/stats ──────────────────────────────
// Get average score per topic
router.get('/stats', async (req, res) => {
  try {
    const scores = await AptitudeScore.find({ userId: req.user._id })

    const topicStats = {}
    scores.forEach(s => {
      if (!topicStats[s.topic]) {
        topicStats[s.topic] = { total: 0, count: 0, best: 0 }
      }
      topicStats[s.topic].total += s.percentage
      topicStats[s.topic].count += 1
      topicStats[s.topic].best = Math.max(topicStats[s.topic].best, s.percentage)
    })

    const stats = Object.entries(topicStats).map(([topic, data]) => ({
      topic,
      average: Math.round(data.total / data.count),
      best:    data.best,
      attempts: data.count,
    }))

    const overallAvg = scores.length > 0
      ? Math.round(scores.reduce((a, s) => a + s.percentage, 0) / scores.length)
      : 0

    res.json({ stats, overallAvg, totalAttempts: scores.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router