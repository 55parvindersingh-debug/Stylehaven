const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const { isEmail, requiredString } = require('../utils/validation');
const router = express.Router();
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, topic, message } = req.body || {};
  if (!requiredString(name, 2, 100) || !isEmail(email) || !requiredString(message, 10, 1500)) return res.status(400).json({ message: 'Provide a valid name, email address and message of at least 10 characters.' });
  const record = await ContactMessage.create({ customer: req.user?._id || null, name: String(name).trim(), email: String(email).trim().toLowerCase(), topic, message: String(message).trim() });
  return res.status(201).json({ message: 'Your message has been received.', contactMessage: record });
}));
router.get('/', allowRoles('admin'), asyncHandler(async (req, res) => { const filter = req.query.status ? { status: req.query.status } : {}; return res.json({ contactMessages: await ContactMessage.find(filter).sort({ createdAt: -1 }).lean() }); }));
router.patch('/:id/status', allowRoles('admin'), asyncHandler(async (req, res) => { const record = await ContactMessage.findById(req.params.id); if (!record) return res.status(404).json({ message: 'Message not found.' }); record.status = req.body?.status; await record.save(); return res.json({ message: 'Message status updated.', contactMessage: record }); }));
module.exports = router;
