const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, allowRoles } = require('../middleware/auth');
const { requiredString } = require('../utils/validation');
const router = express.Router();
async function refreshProductRating(productId) {
  if (!productId) return;
  const [summary] = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Product.updateOne({ _id: productId }, { $set: { ratingAverage: summary ? Number(summary.average.toFixed(1)) : 0, ratingCount: summary?.count || 0 } });
}
router.get('/', asyncHandler(async (req, res) => {
  const filter = { status: 'approved' }; if (req.query.product) filter.product = req.query.product;
  const reviews = await Review.find(filter).populate('product', 'name slug image').sort({ createdAt: -1 }).lean();
  return res.json({ reviews });
}));
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { product, rating, text } = req.body || {};
  if (!(await Product.exists({ _id: product, status: 'active' }))) return res.status(400).json({ message: 'Select a valid active product.' });
  const score = Number(rating); if (!Number.isInteger(score) || score < 1 || score > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  if (!requiredString(text, 10, 1000)) return res.status(400).json({ message: 'Review must contain 10 to 1000 characters.' });
  const review = await Review.create({ customer: req.user._id, product, name: req.user.fullName, rating: score, text: String(text).trim(), status: 'pending' });
  return res.status(201).json({ message: 'Review submitted for moderation.', review });
}));
router.get('/admin/all', allowRoles('admin'), asyncHandler(async (_req, res) => res.json({ reviews: await Review.find().populate('product', 'name').populate('customer', 'fullName email').sort({ createdAt: -1 }).lean() })));
router.patch('/:id/status', allowRoles('admin'), asyncHandler(async (req, res) => {
  const status = String(req.body?.status || ''); if (!['pending','approved','rejected'].includes(status)) return res.status(400).json({ message: 'Invalid review status.' });
  const review = await Review.findById(req.params.id); if (!review) return res.status(404).json({ message: 'Review not found.' });
  review.status = status; await review.save(); await refreshProductRating(review.product);
  return res.json({ message: 'Review status updated and product rating recalculated.', review });
}));
router.delete('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id); if (!review) return res.status(404).json({ message: 'Review not found.' });
  await refreshProductRating(review.product); return res.json({ message: 'Review deleted and product rating recalculated.' });
}));
module.exports = router;
