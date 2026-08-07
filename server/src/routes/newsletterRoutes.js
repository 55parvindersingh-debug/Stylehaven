const express = require('express');
const Newsletter = require('../models/Newsletter');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const { isEmail } = require('../utils/validation');
const router = express.Router();
router.post('/', asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase(); if (!isEmail(email)) return res.status(400).json({ message: 'Provide a valid email address.' });
  const subscription = await Newsletter.findOneAndUpdate({ email }, { email, status: 'subscribed' }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  return res.status(201).json({ message: 'You are subscribed to StyleHaven updates.', subscription });
}));
router.post('/unsubscribe', asyncHandler(async (req, res) => { const email = String(req.body?.email || '').trim().toLowerCase(); if (!isEmail(email)) return res.status(400).json({ message: 'Provide a valid email address.' }); const subscription = await Newsletter.findOneAndUpdate({ email }, { status: 'unsubscribed' }, { new: true }); return res.json({ message: 'Subscription preference updated.', subscription }); }));
router.get('/', allowRoles('admin'), asyncHandler(async (_req, res) => res.json({ subscriptions: await Newsletter.find().sort({ createdAt: -1 }).lean() })));
router.patch('/:id/status', allowRoles('admin'), asyncHandler(async (req, res) => { const subscription = await Newsletter.findById(req.params.id); if (!subscription) return res.status(404).json({ message: 'Subscription not found.' }); subscription.status = req.body?.status; await subscription.save(); return res.json({ message: 'Subscription status updated.', subscription }); }));
module.exports = router;
