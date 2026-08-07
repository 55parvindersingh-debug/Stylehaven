const mongoose = require('mongoose');
const contactMessageSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  topic: { type: String, required: true, enum: ['size-and-fit', 'order', 'delivery', 'returns', 'stock', 'product', 'other'] },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 1500 },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new', index: true },
}, { timestamps: true });
module.exports = mongoose.model('ContactMessage', contactMessageSchema);
