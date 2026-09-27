const express = require('express');
const Meal = require('../models/Meal');
const MonthlyFee = require('../models/MonthlyFee');

const router = express.Router();

const MEAL_PRICES = {
  breakfast: 30,
  lunch: 40,
  snacks: 20,
  dinner: 40,
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function calculateDailyCost(meals) {
  let cost = 0;
  Object.keys(MEAL_PRICES).forEach((key) => {
    if (meals[key]) {
      cost += MEAL_PRICES[key];
    }
  });
  return cost;
}

router.post('/select', async (req, res) => {
  try {
    const { userId, date, meals } = req.body;

    if (!userId || !date || !meals) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const day = startOfDay(date);

    let mealDoc = await Meal.findOne({ userId, date: day });
    if (!mealDoc) {
      mealDoc = new Meal({ userId, date: day, meals });
    } else {
      mealDoc.meals = meals;
    }

    const dailyCost = calculateDailyCost(meals);
    mealDoc.totalCostForDay = dailyCost;

    await mealDoc.save();

    const bookingDate = new Date(day);
    const month = bookingDate.getMonth() + 1;
    const year = bookingDate.getFullYear();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const monthMeals = await Meal.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    let totalAmount = 0;
    monthMeals.forEach((m) => {
      totalAmount += m.totalCostForDay || 0;
    });

    let monthlyFee = await MonthlyFee.findOne({ userId, month, year });
    if (!monthlyFee) {
      monthlyFee = await MonthlyFee.create({ userId, month, year, totalAmount });
    } else {
      monthlyFee.totalAmount = totalAmount;
      await monthlyFee.save();
    }

    res.json({
      meal: mealDoc,
      dailyCost,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/monthly-cost/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const meals = await Meal.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    let monthlyCost = 0;
    meals.forEach((m) => {
      monthlyCost += calculateDailyCost(m.meals);
    });

    res.json({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalDays: meals.length,
      monthlyCost,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
