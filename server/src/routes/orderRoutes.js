const express = require('express');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, allowRoles } = require('../middleware/auth');
const { createOrder, cancelOrder } = require('../services/orderService');
const { isEmail, requiredString } = require('../utils/validation');
const { canTransitionOrderStatus } = require('../utils/orderStatus');
const router = express.Router();

function validateAddress(address = {}) {
  if (!requiredString(address.fullName, 2, 100)) return 'Full name is required.';
  if (!isEmail(address.email)) return 'A valid email address is required.';
  if (!requiredString(address.phone, 5, 30)) return 'Phone number is required.';
  if (!requiredString(address.line1, 3, 120)) return 'Address line 1 is required.';
  if (!requiredString(address.city, 2, 80)) return 'City is required.';
  if (!requiredString(address.postcode, 2, 20)) return 'Postcode is required.';
  return null;
}
router.post('/checkout', requireAuth, asyncHandler(async (req, res) => {
  const shippingAddress = req.body?.shippingAddress || {};
  const error = validateAddress(shippingAddress); if (error) return res.status(400).json({ message: error });
  const paymentMethod = ['card-demo', 'cash-on-delivery'].includes(req.body?.paymentMethod) ? req.body.paymentMethod : 'card-demo';
  const order = await createOrder(req, req.user, shippingAddress, paymentMethod, String(req.body?.notes || '').trim());
  return res.status(201).json({ message: 'Order placed successfully. No real payment was collected.', order });
}));
router.get('/mine', requireAuth, asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ placedAt: -1 }).lean();
  return res.json({ orders });
}));
router.get('/mine/:id', requireAuth, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id }).lean();
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  return res.json({ order });
}));
router.patch('/mine/:id/cancel', requireAuth, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  await cancelOrder(order);
  return res.json({ message: 'Order cancelled and stock restored.', order });
}));
router.get('/', allowRoles('admin'), asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(filter).populate('customer', 'fullName email customerId').sort({ placedAt: -1 }).limit(500).lean();
  return res.json({ orders });
}));
router.patch('/:id/status', allowRoles('admin'), asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  const next = String(req.body?.status || '');
  if (!canTransitionOrderStatus(order.status, next)) return res.status(409).json({ message: `Order cannot move from ${order.status} to ${next}.` });
  if (next === 'cancelled') await cancelOrder(order); else { order.status = next; await order.save(); }
  return res.json({ message: 'Order status updated.', order });
}));
module.exports = router;
