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

const databaseDir = path.join(__dirname, '../../../database');
const datasets = [
  ['users.json', User], ['categories.json', Category], ['products.json', Product], ['coupons.json', Coupon],
  ['orders.json', Order], ['reviews.json', Review], ['contactmessages.json', ContactMessage], ['newsletters.json', Newsletter],
];
function readJson(filename) { return JSON.parse(fs.readFileSync(path.join(databaseDir, filename), 'utf8')); }
async function seed() {
  await connectDatabase();
  console.log('Removing existing StyleHaven seed collections...');
  for (const [, Model] of datasets.slice().reverse()) await Model.deleteMany({});
  for (const [filename, Model] of datasets) {
    const records = readJson(filename);
    if (records.length) await Model.insertMany(records, { ordered: true });
    console.log(`${Model.modelName}: ${records.length} record(s) imported.`);
  }
  console.log('\nStyleHaven seed completed successfully.');
  console.log('Admin: admin@stylehaven.demo / Admin123!');
  console.log('Customer: customer@stylehaven.demo / Customer123!');
}
seed().catch((error) => { console.error('Seed failed:', error); process.exitCode = 1; }).finally(async () => mongoose.connection.close());
