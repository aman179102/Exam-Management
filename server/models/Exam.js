const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Final'],
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  date: {
    type: Date,
  },
});

module.exports = mongoose.model('Exam', ExamSchema);
