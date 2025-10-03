const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');

// @desc    Get all photos
// @route   GET /api/gallery
// @access  Public
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Upload a photo
// @route   POST /api/gallery
// @access  Private/Admin
exports.uploadPhoto = async (req, res) => {
  const { title } = req.body;
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload a file' });
  }

  const newPhoto = new Photo({
    title,
    imageUrl: `/uploads/${req.file.filename}`,
  });

  try {
    const photo = await newPhoto.save();
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a photo
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    // Delete image from server
    const imagePath = path.join(__dirname, '..', 'public', photo.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await photo.deleteOne();

    res.json({ msg: 'Photo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
