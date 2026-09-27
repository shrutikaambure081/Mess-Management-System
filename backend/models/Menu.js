const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  dinner: { type: String, default: '' },
  snacks: { type: String, default: '' }
});

module.exports = mongoose.model('Menu', menuSchema);
