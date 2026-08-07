const test = require('node:test');
const assert = require('node:assert/strict');
const { deliveryFeeFor, discountFor, cartTotals } = require('./pricing');
test('delivery and coupon rules calculate correctly', () => {
  assert.equal(deliveryFeeFor(74.99), 4.99); assert.equal(deliveryFeeFor(75), 0);
  assert.equal(discountFor(80, { discountType: 'percentage', value: 10 }), 8);
  assert.equal(discountFor(20, { discountType: 'fixed', value: 50 }), 20);
});
test('cart totals combine values correctly', () => {
  assert.deepEqual(cartTotals([50, 25], { discountType: 'percentage', value: 10 }), { subtotal: 75, deliveryFee: 0, discount: 7.5, total: 67.5 });
});
