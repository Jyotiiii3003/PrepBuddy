const mongoose = require('mongoose')

const StreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  problemsSolved: {
    type: Number,
    default: 0,
  },
})

StreakSchema.index({ userId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Streak', StreakSchema)