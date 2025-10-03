const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPhotos, uploadPhoto, deletePhoto } = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Multer config for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// @route   GET api/gallery
// @desc    Get all photos
// @access  Public
router.get('/', getPhotos);

// @route   POST api/gallery
// @desc    Upload a photo
// @access  Private/Admin
router.post('/', [auth, admin], upload.single('image'), uploadPhoto);

// @route   DELETE api/gallery/:id
// @desc    Delete a photo
// @access  Private/Admin
router.delete('/:id', [auth, admin], deletePhoto);

module.exports = router;
