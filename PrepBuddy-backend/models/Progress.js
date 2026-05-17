const mongoose = require('mongoose')

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: Number,
    required: true,
  },
  problemTitle: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  status: {
    type: String,
    enum: ['solved', 'attempted', 'unsolved'],
    default: 'unsolved',
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
})

// Each user can only have one entry per problem
ProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true })

module.exports = mongoose.model('Progress', ProgressSchema)