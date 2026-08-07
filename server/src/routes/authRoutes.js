const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { isEmail, isStrongEnoughPassword, requiredString } = require('../utils/validation');
const { makeCustomerId } = require('../utils/helpers');

const router = express.Router();

function publicUser(user) {
  if (!user) return null;
  return typeof user.toSafeObject === 'function' ? user.toSafeObject() : user;
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => req.session.regenerate((error) => (error ? reject(error) : resolve())));
}
function saveSession(req) {
  return new Promise((resolve, reject) => req.session.save((error) => (error ? reject(error) : resolve())));
}
function destroySession(req) {
  return new Promise((resolve, reject) => req.session.destroy((error) => (error ? reject(error) : resolve())));
}

router.post('/signup', asyncHandler(async (req, res) => {
  const { fullName, email, password, phone = '' } = req.body || {};
  if (!requiredString(fullName, 2, 100)) return res.status(400).json({ message: 'Full name must contain 2 to 100 characters.' });
  if (!isEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address.' });
  if (!isStrongEnoughPassword(password)) return res.status(400).json({ message: 'Password must contain at least 8 characters, including letters and a number.' });
  const normalizedEmail = String(email).trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
  let customerId = makeCustomerId();
  while (await User.exists({ customerId })) customerId = makeCustomerId();
  const user = await User.create({ customerId, fullName: String(fullName).trim(), email: normalizedEmail, password, phone: String(phone).trim(), role: 'customer' });
  const cart = Array.isArray(req.session.cart) ? req.session.cart : [];
  const couponCode = req.session.couponCode || null;
  await regenerateSession(req);
  req.session.cart = cart;
  req.session.couponCode = couponCode;
  req.session.user = { id: String(user._id), role: user.role };
  await saveSession(req);
  return res.status(201).json({ message: 'Account created successfully.', user: publicUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!isEmail(email) || !password) return res.status(400).json({ message: 'Enter a valid email address and password.' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  if (user.status !== 'active') return res.status(403).json({ message: 'This account is inactive. Contact an administrator.' });
  const cart = Array.isArray(req.session.cart) ? req.session.cart : [];
  const couponCode = req.session.couponCode || null;
  await regenerateSession(req);
  req.session.cart = cart;
  req.session.couponCode = couponCode;
  req.session.user = { id: String(user._id), role: user.role };
  await saveSession(req);
  return res.json({ message: 'Logged in successfully.', user: publicUser(user) });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  await destroySession(req);
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(process.env.SESSION_COOKIE_NAME || 'stylehaven.sid', { httpOnly: true, secure: isProduction, sameSite: isProduction && process.env.SERVE_CLIENT !== 'true' ? 'none' : 'lax' });
  return res.json({ message: 'Logged out successfully.' });
}));

router.get('/me', (req, res) => res.json({ user: publicUser(req.user) }));

router.put('/profile', requireAuth, asyncHandler(async (req, res) => {
  const { fullName, phone = '', address = {} } = req.body || {};
  if (!requiredString(fullName, 2, 100)) return res.status(400).json({ message: 'Full name must contain 2 to 100 characters.' });
  req.user.fullName = String(fullName).trim();
  req.user.phone = String(phone).trim();
  req.user.address = {
    line1: String(address.line1 || '').trim(), line2: String(address.line2 || '').trim(), city: String(address.city || '').trim(),
    postcode: String(address.postcode || '').trim(), country: String(address.country || 'United Kingdom').trim(),
  };
  await req.user.save();
  return res.json({ message: 'Profile updated successfully.', user: publicUser(req.user) });
}));

router.put('/password', requireAuth, asyncHandler(async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (!isStrongEnoughPassword(newPassword)) return res.status(400).json({ message: 'New password must contain at least 8 characters, including letters and a number.' });
  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ message: 'Current password is incorrect.' });
  user.password = newPassword;
  await user.save();
  return res.json({ message: 'Password changed successfully.' });
}));

module.exports = router;
