const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'manager'], default: 'student' },
  skipTotal: { type: Number, default: 0 },
  skipCurrentStreak: { type: Number, default: 0 },
  skipHighlight: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
