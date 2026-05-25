const mongoose = require('mongoose')

const AptitudeScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('AptitudeScore', AptitudeScoreSchema)