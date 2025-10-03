const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, getMe);

// @route   POST api/auth/register
// @desc    Register user
// @access  Private (Admin only)
router.post('/register', [auth, admin], registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

module.exports = router;
