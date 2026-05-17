const express = require('express')
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')
const protect = require('../middleware/auth')
const router  = express.Router()

// Helper to generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// ── POST /api/auth/signup ────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, college, targetCompany } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, college, targetCompany })

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id:            user._id,
        name:          user.name,
        email:         user.email,
        college:       user.college,
        targetCompany: user.targetCompany,
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/auth/login ─────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id:            user._id,
        name:          user.name,
        email:         user.email,
        college:       user.college,
        targetCompany: user.targetCompany,
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id:             req.user._id,
      name:           req.user.name,
      email:          req.user.email,
      college:        req.user.college,
      targetCompany:  req.user.targetCompany,
      readinessScore: req.user.readinessScore,
    }
  })
})

module.exports = router