const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://prep-buddy-rho.vercel.app/', // ← your Vercel URL
  ],
  credentials: true
}))
app.use(express.json())

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/progress', require('./routes/progress'))
app.use('/api/user',     require('./routes/user'))

app.get('/', (req, res) => res.json({ message: 'PrepBuddy API is running!' }))
app.use('/api/ai', require('./routes/ai'))
app.use('/api/aptitude', require('./routes/aptitude'))
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected successfully')
    app.listen(process.env.PORT || 5000, () => {
      console.log(` Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })