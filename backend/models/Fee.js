const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // e.g. '2025-11'
  amountDue: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' }
});

feeSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Fee', feeSchema);
