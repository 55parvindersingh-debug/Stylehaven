const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 350, default: '' },
  image: { type: String, trim: true, default: '' },
  displayOrder: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
}, { timestamps: true });
module.exports = mongoose.model('Category', categorySchema);
