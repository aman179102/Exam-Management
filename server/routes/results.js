const express = require('express');
const router = express.Router();
const { submitExam, getResults, getMyResults, getTestResults, getAnalytics } = require('../controllers/resultController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/results/submit
// @desc    Submit an exam and save the result
// @access  Private (Student)
router.post('/submit', auth, submitExam);

// @route   GET api/results/my-results
// @desc    Get results for the logged-in student
// @access  Private (Student)
router.get('/my-results', auth, getMyResults);

// @route   GET api/results
// @desc    Get all exam results (for admin dashboard)
// @access  Private (Admin)
router.get('/', [auth, admin], getResults);

// @route   GET api/results/test-results
// @desc    Get all test results for analytics
// @access  Private (Admin)
router.get('/test-results', [auth, admin], getTestResults);

// @route   GET api/results/analytics
// @desc    Get analytics data for admin dashboard
// @access  Private (Admin)
router.get('/analytics', [auth, admin], getAnalytics);

module.exports = router;
