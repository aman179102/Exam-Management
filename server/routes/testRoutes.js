const express = require('express');
const router = express.Router();
const { createTest, getTests, getTestById, submitTest, publishTest, deleteTest } = require('../controllers/testController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/tests
// @desc    Create a test
// @access  Private/Admin
router.post('/', [auth, admin], createTest);

// @route   GET api/tests
// @desc    Get all tests
// @access  Private
router.get('/', auth, getTests);

// @route   GET api/tests/:id
// @desc    Get a single test
// @access  Private
router.get('/:id', auth, getTestById);

// @route   POST api/tests/:id/submit
// @desc    Submit a test
// @access  Private
router.post('/:id/submit', auth, submitTest);

// @route   POST api/tests/:id/publish
// @desc    Publish a test
// @access  Private/Admin
router.post('/:id/publish', [auth, admin], publishTest);

// @route   DELETE api/tests/:id
// @desc    Delete a test
// @access  Private/Admin
router.delete('/:id', [auth, admin], deleteTest);

module.exports = router;
