const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

// @desc    Create a new test (admin only)
// @route   POST /api/tests
// @access  Private/Admin
exports.createTest = async (req, res) => {
  const { title, description, timeLimit, questions } = req.body;

  try {
    // Input validation
    if (!title || !description || !timeLimit || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'All fields are required and at least one question must be provided' });
    }

    if (timeLimit <= 0) {
      return res.status(400).json({ message: 'Time limit must be greater than 0' });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !question.options || !question.correctAnswer || !question.difficulty) {
        return res.status(400).json({ message: `Question ${i + 1} is missing required fields` });
      }
      
      if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
        return res.status(400).json({ message: `Question ${i + 1} has invalid correct answer` });
      }
    }

    const test = new Test({
      title,
      description,
      timeLimit,
      questions,
    });

    const createdTest = await test.save();
    res.status(201).json(createdTest);
  } catch (error) {
    console.error('Test creation error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
exports.getTests = async (req, res) => {
  try {
    let tests;
    // If the user is an admin, send the full test details
    if (req.user && req.user.role === 'admin') {
      tests = await Test.find({});
    } else {
      // For students, exclude sensitive details like correct answers
      tests = await Test.find({}, '-questions.correctAnswer');
    }
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single test by ID
// @route   GET /api/tests/:id
// @access  Private
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id, '-questions.correctAnswer'); // Exclude correct answers
    if (test) {
      res.json(test);
    } else {
      res.status(404).json({ message: 'Test not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit a test and get the score
// @route   POST /api/tests/:id/submit
// @access  Private
exports.submitTest = async (req, res) => {
  const { answers } = req.body;

  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let score = 0;
    test.questions.forEach((question) => {
      if (answers[question._id] && question.correctAnswer === answers[question._id]) {
        score++;
      }
    });

    const totalQuestions = test.questions.length;

    const result = new TestResult({
        test: req.params.id,
        student: req.user.id, // Assuming user ID is available from auth middleware
        score,
        answers,
    });

    await result.save();

    res.json({ score, totalQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Publish a test to make it live
// @route   POST /api/tests/:id/publish
// @access  Private/Admin
exports.publishTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // In a real app, you'd emit this to a socket.io channel
        // For now, we'll just return the test
        const io = req.io;
        io.emit('new-test', test);

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    await test.deleteOne();

    res.json({ message: 'Test removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
