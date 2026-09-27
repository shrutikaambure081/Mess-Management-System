const express = require('express');
const Complaint = require('../models/Complaint');

const router = express.Router();

// GET /api/complaints?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const complaints = await Complaint.find(filter).sort({ date: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/complaints
router.post('/', async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const complaint = await Complaint.create({
      userId,
      title,
      description
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/complaints/:id - update status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
