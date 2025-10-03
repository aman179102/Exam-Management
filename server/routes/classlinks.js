const express = require('express');
const router = express.Router();
const { getAllClassLinks, createClassLink, updateClassLink, deleteClassLink } = require('../controllers/classLinkController');
const auth = require('../middleware/auth');

// @route   GET api/classlinks
// @desc    Get all class links
// @access  Private
router.get('/', auth, getAllClassLinks);

// @route   POST api/classlinks
// @desc    Create a class link
// @access  Private (Admin)
router.post('/', auth, createClassLink);

// @route   PUT api/classlinks/:id
// @desc    Update a class link
// @access  Private (Admin)
router.put('/:id', auth, updateClassLink);

// @route   DELETE api/classlinks/:id
// @desc    Delete a class link
// @access  Private (Admin)
router.delete('/:id', auth, deleteClassLink);

module.exports = router;
