const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const { escapeRegex } = require('../utils/validation');
const router = express.Router();
router.get('/', allowRoles('admin'), asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) { const term = escapeRegex(req.query.search); filter.$or = [{ fullName: new RegExp(term, 'i') }, { email: new RegExp(term, 'i') }, { customerId: new RegExp(term, 'i') }]; }
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  return res.json({ users });
}));
router.patch('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (String(user._id) === String(req.user._id)) {
    if (req.body?.status === 'inactive') return res.status(409).json({ message: 'You cannot deactivate your own administrator account.' });
    if (req.body?.role && req.body.role !== 'admin') return res.status(409).json({ message: 'You cannot remove your own administrator role.' });
  }
  if (req.body?.role !== undefined) user.role = req.body.role;
  if (req.body?.status !== undefined) user.status = req.body.status;
  await user.save();
  return res.json({ message: 'User updated.', user: user.toSafeObject() });
}));
router.get('/:id/orders', allowRoles('admin'), asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.params.id }).sort({ placedAt: -1 }).lean();
  return res.json({ orders });
}));
module.exports = router;
