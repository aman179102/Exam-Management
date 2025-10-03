const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true, default: false },
    },
  ],
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
});

module.exports = mongoose.model('Question', QuestionSchema);
