const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/progress', require('./routes/progress'))
app.use('/api/user',     require('./routes/user'))

app.get('/', (req, res) => res.json({ message: 'PrepBuddy API is running!' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })