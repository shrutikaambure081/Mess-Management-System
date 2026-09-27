const express = require('express');
const Meal = require('../models/Meal');
const User = require('../models/User');

const router = express.Router();

function isSkipDay(meals) {
  return !meals.breakfast && !meals.lunch && !meals.dinner && !meals.snacks;
}

function dayOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// GET /api/skipdays?userId=...
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ userId: 1, date: 1 });

    const byUser = {};

    meals.forEach((m) => {
      const userId = String(m.userId);
      if (!byUser[userId]) {
        byUser[userId] = {
          userId,
          totalSkippedDays: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastSkipDate: null
        };
      }

      if (isSkipDay(m.meals)) {
        const info = byUser[userId];
        info.totalSkippedDays += 1;

        const d = dayOnly(m.date);
        if (!info.lastSkipDate) {
          info.currentStreak = 1;
        } else {
          const diffDays =
            (d.getTime() - info.lastSkipDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            info.currentStreak += 1;
          } else {
            info.currentStreak = 1;
          }
        }
        info.lastSkipDate = d;
        if (info.currentStreak > info.maxStreak) {
          info.maxStreak = info.currentStreak;
        }
      }
    });

    const userIds = Object.keys(byUser);
    const users = await User.find({ _id: { $in: userIds } });
    const userMap = {};
    users.forEach((u) => {
      userMap[String(u._id)] = u;
    });

    const summaries = await Promise.all(
      userIds.map(async (id) => {
        const info = byUser[id];
        const user = userMap[id];
        const highlight = info.currentStreak >= 3;

        if (user) {
          user.skipTotal = info.totalSkippedDays;
          user.skipCurrentStreak = info.currentStreak;
          user.skipHighlight = highlight;
          await user.save();
        }

        return {
          userId: id,
          name: user ? user.name : '',
          email: user ? user.email : '',
          totalSkippedDays: info.totalSkippedDays,
          currentStreak: info.currentStreak,
          maxStreak: info.maxStreak,
          highlight
        };
      })
    );

    const { userId } = req.query;
    if (userId) {
      const one = summaries.find((s) => s.userId === userId);
      return res.json(one || null);
    }

    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
