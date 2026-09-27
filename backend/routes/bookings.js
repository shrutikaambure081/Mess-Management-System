const express = require('express');
const Meal = require('../models/Meal');

const router = express.Router();

function calculateDailyCostFromDoc(mealDoc) {
  if (mealDoc.totalCostForDay != null) return mealDoc.totalCostForDay;
  const prices = { breakfast: 30, lunch: 40, snacks: 20, dinner: 40 };
  let total = 0;
  Object.keys(prices).forEach((key) => {
    if (mealDoc.meals && mealDoc.meals[key]) {
      total += prices[key];
    }
  });
  return total;
}

// GET /api/bookings/summary/:userId/:month/:year
router.get('/summary/:userId/:month/:year', async (req, res) => {
  try {
    const { userId, month, year } = req.params;
    const monthNum = Number(month);
    const yearNum = Number(year);

    const start = new Date(yearNum, monthNum - 1, 1);
    const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const meals = await Meal.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    let monthlyTotal = 0;
    const days = meals.map((m) => {
      const cost = calculateDailyCostFromDoc(m);
      monthlyTotal += cost;
      return {
        _id: m._id,
        date: m.date,
        meals: m.meals,
        totalCostForDay: cost,
      };
    });

    res.json({
      month: monthNum,
      year: yearNum,
      days,
      monthlyTotal,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
