require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');
const outputDir = path.join(__dirname, '../../../database');
const datasets = [
  ['users.json', User], ['categories.json', Category], ['products.json', Product], ['coupons.json', Coupon],
  ['orders.json', Order], ['reviews.json', Review], ['contactmessages.json', ContactMessage], ['newsletters.json', Newsletter],
];
async function exportDatabase() {
  await connectDatabase(); fs.mkdirSync(outputDir, { recursive: true });
  for (const [filename, Model] of datasets) {
    const records = await Model.find().select(Model === User ? '+password' : '').lean();
    fs.writeFileSync(path.join(outputDir, filename), `${JSON.stringify(records, null, 2)}\n`);
    console.log(`${filename}: ${records.length} record(s) exported.`);
  }
}
exportDatabase().catch((error) => { console.error('Export failed:', error); process.exitCode = 1; }).finally(async () => mongoose.connection.close());
