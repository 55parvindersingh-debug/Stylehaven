const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

async function populatedWishlist(userId) {
  const user = await User.findById(userId).populate({ path: 'wishlist', match: { status: 'active' }, populate: { path: 'category', select: 'name slug' } }).lean();
  return user?.wishlist || [];
}
router.get('/', requireAuth, asyncHandler(async (req, res) => res.json({ items: await populatedWishlist(req.user._id) })));
router.post('/:productId', requireAuth, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId)) return res.status(400).json({ message: 'Invalid product identifier.' });
  if (!(await Product.exists({ _id: req.params.productId, status: 'active' }))) return res.status(404).json({ message: 'Product not found.' });
  await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.productId } });
  return res.status(201).json({ message: 'Product saved to your wishlist.', items: await populatedWishlist(req.user._id) });
}));
router.delete('/:productId', requireAuth, asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.productId } });
  return res.json({ message: 'Product removed from your wishlist.', items: await populatedWishlist(req.user._id) });
}));
module.exports = router;
