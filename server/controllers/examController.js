const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('questions');
    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create an exam
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
  const { title, level, date } = req.body;

  try {
    const newExam = new Exam({
      title,
      level,
      date,
    });

    const exam = await newExam.save();
    req.io.emit('exam_created', exam);
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add a question to an exam
// @route   POST /api/exams/:id/questions
// @access  Private (Admin)
exports.addQuestionToExam = async (req, res) => {
  const { questionText, options, level } = req.body;

  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    const newQuestion = new Question({
      questionText,
      options,
      level,
    });

    const question = await newQuestion.save();

    exam.questions.push(question._id);
    await exam.save();

    res.json(exam.questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
