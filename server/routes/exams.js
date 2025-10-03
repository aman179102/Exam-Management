const express = require('express');
const router = express.Router();
const { getAllExams, createExam, addQuestionToExam } = require('../controllers/examController');
const auth = require('../middleware/auth'); // We will create this middleware next

// @route   GET api/exams
// @desc    Get all exams
// @access  Private
router.get('/', auth, getAllExams);

// @route   POST api/exams
// @desc    Create an exam
// @access  Private (Admin)
router.post('/', auth, createExam);

// @route   POST api/exams/:id/questions
// @desc    Add a question to an exam
// @access  Private (Admin)
router.post('/:id/questions', auth, addQuestionToExam);

module.exports = router;
