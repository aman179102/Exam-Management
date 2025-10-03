const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  timeLimit: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 300, // Max 5 hours
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
      options: {
        A: { type: String, required: true, trim: true, maxlength: 200 },
        B: { type: String, required: true, trim: true, maxlength: 200 },
        C: { type: String, required: true, trim: true, maxlength: 200 },
        D: { type: String, required: true, trim: true, maxlength: 200 },
      },
      correctAnswer: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D'],
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Test', TestSchema);
