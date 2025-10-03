const Result = require('../models/Result');
const Exam = require('../models/Exam');

// @route   POST api/results/submit
// @desc    Submit an exam and save the result
// @access  Private (Student)
exports.submitExam = async (req, res) => {
  const { examId, answers } = req.body;

  try {
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    let score = 0;
    const detailedAnswers = exam.questions.map((question) => {
      const studentAnswer = answers.find((ans) => ans.questionId === question._id.toString());
      if (!studentAnswer) {
        return { questionId: question._id, selectedOption: -1, isCorrect: false };
      }

      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
      const isCorrect = parseInt(studentAnswer.selectedOption) === correctOptionIndex;
      if (isCorrect) {
        score++;
      }

      return {
        questionId: question._id,
        selectedOption: studentAnswer.selectedOption,
        isCorrect,
      };
    });

    const finalScore = (score / exam.questions.length) * 100;

    const result = new Result({
      exam: examId,
      student: req.user.id,
      score: finalScore,
      answers: detailedAnswers,
    });

    await result.save();

    // Emit real-time event for new result
    const io = req.app.get('socketio');
    io.emit('new-result', result);

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/results
// @desc    Get all exam results (for admin dashboard)
// @access  Private (Admin)
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().populate('student', 'username').populate('exam', 'title level');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/results/my-results
// @desc    Get results for the logged-in student
// @access  Private (Student)
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('exam', 'title level');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/results/test-results
// @desc    Get all test results for analytics
// @access  Private (Admin)
exports.getTestResults = async (req, res) => {
  try {
    const TestResult = require('../models/TestResult');
    const results = await TestResult.find()
      .populate('student', 'username')
      .populate('test', 'title')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching test results:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// @route   GET api/results/analytics
// @desc    Get analytics data for admin dashboard
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const TestResult = require('../models/TestResult');
    const Test = require('../models/Test');
    const User = require('../models/User');

    // Get all test results with populated data
    const results = await TestResult.find()
      .populate('student', 'username')
      .populate('test', 'title questions')
      .sort({ submittedAt: -1 });

    // Calculate analytics
    const totalTests = await Test.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAttempts = results.length;

    // Test-wise performance
    const testPerformance = {};
    results.forEach(result => {
      const testId = result.test._id.toString();
      const testTitle = result.test.title;
      const totalQuestions = result.test.questions.length;
      const percentage = totalQuestions > 0 ? (result.score / totalQuestions) * 100 : 0;

      if (!testPerformance[testId]) {
        testPerformance[testId] = {
          testTitle,
          attempts: 0,
          totalScore: 0,
          scores: [],
          students: new Set()
        };
      }

      testPerformance[testId].attempts++;
      testPerformance[testId].totalScore += percentage;
      testPerformance[testId].scores.push(percentage);
      testPerformance[testId].students.add(result.student.username);
    });

    // Convert to array format for charts
    const testAnalytics = Object.keys(testPerformance).map(testId => {
      const data = testPerformance[testId];
      return {
        testId,
        testTitle: data.testTitle,
        attempts: data.attempts,
        averageScore: data.totalScore / data.attempts,
        uniqueStudents: data.students.size,
        scores: data.scores
      };
    });

    // Student performance over time
    const studentProgress = {};
    results.forEach(result => {
      const studentName = result.student.username;
      const totalQuestions = result.test.questions.length;
      const percentage = totalQuestions > 0 ? (result.score / totalQuestions) * 100 : 0;

      if (!studentProgress[studentName]) {
        studentProgress[studentName] = [];
      }

      studentProgress[studentName].push({
        testTitle: result.test.title,
        score: percentage,
        date: result.submittedAt
      });
    });

    // Recent activity (last 10 results)
    const recentActivity = results.slice(0, 10).map(result => ({
      studentName: result.student.username,
      testTitle: result.test.title,
      score: result.test.questions.length > 0 ? (result.score / result.test.questions.length) * 100 : 0,
      submittedAt: result.submittedAt
    }));

    res.json({
      summary: {
        totalTests,
        totalStudents,
        totalAttempts,
        averageScore: results.length > 0 ? 
          results.reduce((acc, r) => acc + (r.test.questions.length > 0 ? (r.score / r.test.questions.length) * 100 : 0), 0) / results.length : 0
      },
      testAnalytics,
      studentProgress,
      recentActivity
    });
  } catch (err) {
    console.error('Error fetching analytics:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

