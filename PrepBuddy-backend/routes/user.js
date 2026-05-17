const express  = require('express')
const User     = require('../models/User')
const Progress = require('../models/Progress')
const protect  = require('../middleware/auth')
const router   = express.Router()

router.use(protect)

// ── GET /api/user/profile ────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/user/profile ────────────────────────────────
router.put('/profile', async (req, res) => {
  try {
    const { name, college, targetCompany } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, college, targetCompany },
      { new: true }
    )
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/user/leaderboard ────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const solved = await Progress.aggregate([
      { $match: { status: 'solved' } },
      { $group: { _id: '$userId', solved: { $sum: 1 } } },
      { $sort: { solved: -1 } },
      { $limit: 10 },
    ])

    const userIds = solved.map(s => s._id)
    const users   = await User.find({ _id: { $in: userIds } })
      .select('name college')

    const leaderboard = solved.map((s, i) => {
      const user = users.find(u => u._id.toString() === s._id.toString())
      return {
        rank:    i + 1,
        name:    user?.name    || 'Unknown',
        college: user?.college || 'Unknown',
        solved:  s.solved,
        isYou:   s._id.toString() === req.user._id.toString(),
      }
    })

    res.json({ leaderboard })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router