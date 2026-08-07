const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantKey: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true, uppercase: true },
  size: { type: String, required: true, trim: true, maxlength: 30 },
  color: { type: String, required: true, trim: true, maxlength: 40 },
  stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
  soldQuantity: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  audience: { type: String, enum: ['women', 'men', 'unisex'], default: 'unisex', index: true },
  tag: { type: String, trim: true, maxlength: 50, default: '' },
  brand: { type: String, trim: true, maxlength: 80, default: 'StyleHaven' },
  material: { type: String, trim: true, maxlength: 120, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  careInstructions: { type: String, trim: true, maxlength: 500, default: '' },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0, default: null },
  image: { type: String, required: true, trim: true },
  gallery: [{ type: String, trim: true }],
  sizes: [{ type: String, trim: true, maxlength: 30 }],
  colors: [{ type: String, trim: true, maxlength: 40 }],
  variants: { type: [variantSchema], default: [] },
  ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
  stock: { type: Number, required: true, min: 0, validate: Number.isInteger, index: true },
  soldQuantity: { type: Number, min: 0, validate: Number.isInteger, default: 0 },
  lowStockThreshold: { type: Number, min: 0, validate: Number.isInteger, default: 8 },
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tag: 'text', sku: 'text', brand: 'text', material: 'text' });
module.exports = mongoose.model('Product', productSchema);
