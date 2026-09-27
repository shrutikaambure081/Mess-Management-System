const express = require('express');
const Meal = require('../models/Meal');

const router = express.Router();

const MEAL_PRICES = {
  breakfast: 30,
  lunch: 50,
  dinner: 40,
  snacks: 10,
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

router.get('/today-summary', async (req, res) => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const meals = await Meal.find({
      date: { $gte: start, $lte: end },
    });

    const counts = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0,
    };

    meals.forEach((m) => {
      Object.keys(counts).forEach((key) => {
        if (m.meals[key]) {
          counts[key] += 1;
        }
      });
    });

    res.json({
      date: start,
      counts,
      totalStudents: meals.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/predict', async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const past = new Date(today);
    past.setDate(past.getDate() - 6);

    const meals = await Meal.find({
      date: { $gte: past, $lte: endOfDay(today) },
    });

    const totals = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0,
    };

    meals.forEach((m) => {
      Object.keys(totals).forEach((key) => {
        if (m.meals[key]) {
          totals[key] += 1;
        }
      });
    });

    const days = 7;
    const averages = {};
    Object.keys(totals).forEach((key) => {
      averages[key] = totals[key] / days;
    });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthMeals = await Meal.find({
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const monthlyMeals = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0,
    };
    let totalRevenue = 0;

    monthMeals.forEach((m) => {
      Object.keys(monthlyMeals).forEach((key) => {
        if (m.meals[key]) {
          monthlyMeals[key] += 1;
        }
      });
      totalRevenue += calculateDailyCost(m.meals);
    });

    res.json({
      averages,
      monthly: {
        totalMeals: monthlyMeals,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
