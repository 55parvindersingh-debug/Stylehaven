const express = require('express');
const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const { requiredString, parseNonNegativeNumber } = require('../utils/validation');
const { booleanValue } = require('../utils/helpers');
const router = express.Router();
router.get('/', allowRoles('admin'), asyncHandler(async (_req, res) => res.json({ coupons: await Coupon.find().sort({ createdAt: -1 }).lean() })));
router.post('/', allowRoles('admin'), asyncHandler(async (req, res) => {
  const { code, description = '', discountType = 'percentage', value, minimumSpend = 0, startsAt = null, expiresAt = null, usageLimit = 0, active = true } = req.body || {};
  if (!requiredString(code, 2, 30)) return res.status(400).json({ message: 'Coupon code is required.' });
  const numericValue = parseNonNegativeNumber(value); if (numericValue === null) return res.status(400).json({ message: 'Coupon value must be zero or greater.' });
  if (discountType === 'percentage' && numericValue > 100) return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' });
  const coupon = await Coupon.create({ code: String(code).trim().toUpperCase(), description, discountType, value: numericValue, minimumSpend: parseNonNegativeNumber(minimumSpend, 0), startsAt: startsAt || null, expiresAt: expiresAt || null, usageLimit: Math.max(0, Number.parseInt(usageLimit, 10) || 0), active: booleanValue(active, true) });
  return res.status(201).json({ message: 'Coupon created.', coupon });
}));
router.put('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id); if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
  const fields = ['description', 'discountType', 'startsAt', 'expiresAt'];
  for (const field of fields) if (req.body?.[field] !== undefined) coupon[field] = req.body[field] || (field.includes('At') ? null : '');
  if (req.body?.code !== undefined) coupon.code = String(req.body.code).trim().toUpperCase();
  if (req.body?.value !== undefined) coupon.value = parseNonNegativeNumber(req.body.value, coupon.value);
  if (req.body?.minimumSpend !== undefined) coupon.minimumSpend = parseNonNegativeNumber(req.body.minimumSpend, coupon.minimumSpend);
  if (req.body?.usageLimit !== undefined) coupon.usageLimit = Math.max(0, Number.parseInt(req.body.usageLimit, 10) || 0);
  if (req.body?.active !== undefined) coupon.active = booleanValue(req.body.active);
  if (coupon.discountType === 'percentage' && coupon.value > 100) return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' });
  await coupon.save(); return res.json({ message: 'Coupon updated.', coupon });
}));
router.delete('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id); if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
  coupon.active = false; await coupon.save(); return res.json({ message: 'Coupon deactivated.', coupon });
}));
module.exports = router;
