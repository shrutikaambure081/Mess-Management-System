const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// GET /api/menu?date=YYYY-MM-DD (default today)
router.get('/', async (req, res) => {
  try {
    const dateStr = req.query.date;
    const date = dateStr ? new Date(dateStr) : new Date();
    const day = startOfDay(date);

    const menu = await Menu.findOne({ date: day });
    res.json(menu || null);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu - create or update menu for a day
router.post('/', async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, snacks } = req.body;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    const day = startOfDay(date);

    let menu = await Menu.findOne({ date: day });
    if (!menu) {
      menu = new Menu({ date: day, breakfast, lunch, dinner, snacks });
    } else {
      menu.breakfast = breakfast || '';
      menu.lunch = lunch || '';
      menu.dinner = dinner || '';
      menu.snacks = snacks || '';
    }

    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/menu/:id - update by id (simple)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast, lunch, dinner, snacks } = req.body;

    const menu = await Menu.findByIdAndUpdate(
      id,
      { breakfast, lunch, dinner, snacks },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
