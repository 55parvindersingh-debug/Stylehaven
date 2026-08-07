const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  image: { type: String, trim: true, default: '' },
  size: { type: String, trim: true, default: '' },
  color: { type: String, trim: true, default: '' },
  quantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
  unitPrice: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  line1: { type: String, required: true, trim: true, maxlength: 120 },
  line2: { type: String, trim: true, maxlength: 120, default: '' },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  postcode: { type: String, required: true, trim: true, maxlength: 20 },
  country: { type: String, required: true, trim: true, maxlength: 80, default: 'United Kingdom' },
}, { _id: false });
const orderSchema = new mongoose.Schema({
  orderReference: { type: String, required: true, unique: true, uppercase: true, trim: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], validate: [(items) => items.length > 0, 'An order must contain at least one item.'] },
  shippingAddress: { type: addressSchema, required: true },
  paymentMethod: { type: String, enum: ['card-demo', 'cash-on-delivery'], default: 'card-demo' },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  couponCode: { type: String, uppercase: true, trim: true, default: '' },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending', index: true },
  stockRestored: { type: Boolean, default: false },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
  placedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
