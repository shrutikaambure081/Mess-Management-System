const mongoose = require('mongoose');

const monthlyFeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  studentName: { type: String },
});

monthlyFeeSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyFee', monthlyFeeSchema);
