const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
    snacks: { type: Boolean, default: false },
  },
  totalCostForDay: { type: Number, default: 0 },
});

mealSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Meal', mealSchema);
