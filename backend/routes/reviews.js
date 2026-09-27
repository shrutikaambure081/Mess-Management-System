const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// GET /api/reviews - all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const review = await Review.create({
      userId,
      rating,
      comment
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
