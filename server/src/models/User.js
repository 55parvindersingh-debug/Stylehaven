const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  customerId: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.'] },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  address: {
    line1: { type: String, trim: true, maxlength: 120, default: '' },
    line2: { type: String, trim: true, maxlength: 120, default: '' },
    city: { type: String, trim: true, maxlength: 80, default: '' },
    postcode: { type: String, trim: true, maxlength: 20, default: '' },
    country: { type: String, trim: true, maxlength: 80, default: 'United Kingdom' },
  },
}, { timestamps: true });

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function comparePassword(candidate) { return bcrypt.compare(candidate, this.password); };
userSchema.methods.toSafeObject = function toSafeObject() { const object = this.toObject(); delete object.password; return object; };
module.exports = mongoose.model('User', userSchema);
