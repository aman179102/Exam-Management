const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [auth, admin], getAllUsers);

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', [auth, admin], deleteUser);

module.exports = router;
