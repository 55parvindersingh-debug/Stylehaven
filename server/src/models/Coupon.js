const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 250, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true, min: 0 },
  minimumSpend: { type: Number, min: 0, default: 0 },
  startsAt: { type: Date, default: null }, expiresAt: { type: Date, default: null },
  usageLimit: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
  usedCount: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
