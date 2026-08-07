const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null, index: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
  text: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
