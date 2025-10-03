const ClassLink = require('../models/ClassLink');

// @desc    Delete a class link
// @route   DELETE /api/classlinks/:id
// @access  Private (Admin)
exports.deleteClassLink = async (req, res) => {
  try {
    const classLink = await ClassLink.findById(req.params.id);

    if (!classLink) {
      return res.status(404).json({ msg: 'Class link not found' });
    }

    await ClassLink.findByIdAndDelete(req.params.id);

    // Emit a socket event to notify clients of the deleted link
    req.io.emit('deleted-class-link', req.params.id);

    res.json({ msg: 'Class link removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all class links
// @route   GET /api/classlinks
// @access  Private
exports.getAllClassLinks = async (req, res) => {
  try {
    const links = await ClassLink.find().sort({ date: -1 });
    res.json(links);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a class link
// @route   POST /api/classlinks
// @access  Private (Admin)
exports.createClassLink = async (req, res) => {
  const { title, link } = req.body;

  try {
    const newLink = new ClassLink({
      title,
      link,
    });

    const classLink = await newLink.save();

    // Emit a socket event to notify clients of the new link
    req.io.emit('new-class-link', classLink);

    res.json(classLink);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update a class link
// @route   PUT /api/classlinks/:id
// @access  Private (Admin)
exports.updateClassLink = async (req, res) => {
  const { title, link } = req.body;

  try {
    let classLink = await ClassLink.findById(req.params.id);

    if (!classLink) {
      return res.status(404).json({ msg: 'Class link not found' });
    }

    classLink.title = title;
    classLink.link = link;

    await classLink.save();

    // Emit a socket event to notify clients of the updated link
    req.io.emit('updated-class-link', classLink);

    res.json(classLink);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
