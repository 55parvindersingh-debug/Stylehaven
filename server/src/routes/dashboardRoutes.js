const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const router = express.Router();
router.get('/', allowRoles('admin'), asyncHandler(async (_req, res) => {
  const [customerCount, activeProductCount, lowStockCount, orderCount, pendingOrders, pendingReviews, newMessages, revenueRows, statusBreakdown, topProducts, monthlySales] = await Promise.all([
    User.countDocuments({ role: 'customer' }), Product.countDocuments({ status: 'active' }), Product.countDocuments({ status: 'active', $expr: { $lte: ['$stock', '$lowStockThreshold'] } }),
    Order.countDocuments(), Order.countDocuments({ status: { $in: ['pending', 'processing'] } }), Review.countDocuments({ status: 'pending' }), ContactMessage.countDocuments({ status: 'new' }),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $unwind: '$items' }, { $group: { _id: '$items.product', name: { $first: '$items.name' }, units: { $sum: '$items.quantity' }, sales: { $sum: '$items.lineTotal' } } }, { $sort: { units: -1 } }, { $limit: 5 }]),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: { year: { $year: '$placedAt' }, month: { $month: '$placedAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$total' } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 }]),
  ]);
  return res.json({
    metrics: { customerCount, activeProductCount, lowStockCount, orderCount, pendingOrders, pendingReviews, newMessages, revenue: revenueRows[0]?.revenue || 0 },
    statusBreakdown: statusBreakdown.map((row) => ({ status: row._id, count: row.count })), topProducts,
    monthlySales: monthlySales.map((row) => ({ year: row._id.year, month: row._id.month, orders: row.orders, revenue: row.revenue })),
  });
}));
module.exports = router;
