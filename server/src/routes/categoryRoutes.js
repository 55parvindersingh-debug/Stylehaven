const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { allowRoles } = require('../middleware/auth');
const { requiredString, slugify } = require('../utils/validation');
const { booleanValue } = require('../utils/helpers');
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const includeInactive = req.user?.role === 'admin' && booleanValue(req.query.includeInactive);
  const filter = includeInactive ? {} : { status: 'active' };
  const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();
  return res.json({ categories });
}));
router.post('/', allowRoles('admin'), asyncHandler(async (req, res) => {
  const { name, description = '', image = '', displayOrder = 0, status = 'active' } = req.body || {};
  if (!requiredString(name, 2, 80)) return res.status(400).json({ message: 'Category name must contain 2 to 80 characters.' });
  const category = await Category.create({ name: String(name).trim(), slug: slugify(name), description, image, displayOrder: Number(displayOrder) || 0, status });
  return res.status(201).json({ message: 'Category created.', category });
}));
router.put('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  const { name, description, image, displayOrder, status } = req.body || {};
  if (name !== undefined) { if (!requiredString(name, 2, 80)) return res.status(400).json({ message: 'Invalid category name.' }); category.name = String(name).trim(); category.slug = slugify(name); }
  if (description !== undefined) category.description = String(description);
  if (image !== undefined) category.image = String(image);
  if (displayOrder !== undefined) category.displayOrder = Math.max(0, Number(displayOrder) || 0);
  if (status !== undefined) category.status = status;
  await category.save();
  return res.json({ message: 'Category updated.', category });
}));
router.delete('/:id', allowRoles('admin'), asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  const activeProducts = await Product.countDocuments({ category: category._id, status: 'active' });
  if (activeProducts) return res.status(409).json({ message: 'Deactivate or move the active products in this category first.' });
  category.status = 'inactive'; await category.save();
  return res.json({ message: 'Category deactivated.', category });
}));
module.exports = router;
