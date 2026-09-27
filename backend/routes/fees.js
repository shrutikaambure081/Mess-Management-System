const express = require('express');
const Fee = require('../models/Fee');
const MonthlyFee = require('../models/MonthlyFee');
const Meal = require('../models/Meal');
const User = require('../models/User');

const router = express.Router();

// GET /api/fees - all fees (manager)
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find().sort({ month: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/fees/:userId - fees for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const fees = await Fee.find({ userId }).sort({ month: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/fees - create or update fee for user+month
router.post('/', async (req, res) => {
  try {
    const { userId, month, amountDue, status } = req.body;
    if (!userId || !month || amountDue == null) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    let fee = await Fee.findOne({ userId, month });
    if (!fee) {
      fee = await Fee.create({ userId, month, amountDue, status });
    } else {
      fee.amountDue = amountDue;
      if (status) fee.status = status;
      await fee.save();
    }

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/fees/:id - update status or amount
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountDue, status } = req.body;

    const update = {};
    if (amountDue != null) update.amountDue = amountDue;
    if (status) update.status = status;

    const fee = await Fee.findByIdAndUpdate(id, update, { new: true });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// helper to calculate monthly total from meals
async function calculateMonthlyTotal(userId, month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const meals = await Meal.find({
    userId,
    date: { $gte: start, $lte: end },
  });

  let total = 0;
  meals.forEach((m) => {
    total += m.totalCostForDay || 0;
  });

  return total;
}

// GET /api/fees/calculate/:userId?month=&year=
router.get('/calculate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    const total = await calculateMonthlyTotal(userId, month, year);

    const user = await User.findById(userId);

    let fee = await MonthlyFee.findOne({ userId, month, year });
    if (!fee) {
      fee = await MonthlyFee.create({
        userId,
        month,
        year,
        totalAmount: total,
        studentName: user ? user.name : undefined,
      });
    } else {
      fee.totalAmount = total;
      if (user && !fee.studentName) fee.studentName = user.name;
      await fee.save();
    }

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/fees/markPaid
router.post('/markPaid', async (req, res) => {
  try {
    const { userId, month, year } = req.body;
    if (!userId || !month || !year) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    let fee = await MonthlyFee.findOne({ userId, month, year });
    if (!fee) {
      const totalAmount = await calculateMonthlyTotal(userId, month, year);
      fee = await MonthlyFee.create({ userId, month, year, totalAmount, status: 'paid' });
    } else {
      fee.status = 'paid';
      await fee.save();
    }

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/fees/monthly/all - list all MonthlyFee docs
router.get('/monthly/all', async (req, res) => {
  try {
    const fees = await MonthlyFee.find()
      .populate('userId', 'name email')
      .sort({ year: -1, month: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/fees/monthly/user/:userId - list MonthlyFee for a user
router.get('/monthly/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const fees = await MonthlyFee.find({ userId }).sort({ year: -1, month: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
