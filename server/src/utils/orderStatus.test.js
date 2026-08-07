const test = require('node:test');
const assert = require('node:assert/strict');
const { canTransitionOrderStatus } = require('./orderStatus');
test('order status follows the fulfilment workflow', () => {
  assert.equal(canTransitionOrderStatus('pending', 'processing'), true);
  assert.equal(canTransitionOrderStatus('processing', 'shipped'), true);
  assert.equal(canTransitionOrderStatus('shipped', 'delivered'), true);
  assert.equal(canTransitionOrderStatus('pending', 'delivered'), false);
  assert.equal(canTransitionOrderStatus('delivered', 'pending'), false);
});
