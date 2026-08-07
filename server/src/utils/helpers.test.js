const test = require('node:test');
const assert = require('node:assert/strict');
const { roundMoney, normaliseSize, normaliseColor, cartLineId, makeCustomerId, makeOrderReference, booleanValue } = require('./helpers');
test('money and clothing variant helpers are stable', () => {
  assert.equal(roundMoney(10.005), 10.01);
  assert.equal(normaliseSize(' XL '), 'XL');
  assert.equal(normaliseColor(' Forest Green '), 'Forest Green');
  assert.equal(normaliseSize('<invalid>'), '');
  assert.equal(cartLineId('abc', 'M', 'Navy'), 'abc:M:Navy');
  assert.equal(booleanValue('false', true), false);
});
test('generated references have expected prefixes', () => {
  assert.match(makeCustomerId(), /^CUS-\d{4}-\d{6}$/);
  assert.match(makeOrderReference(), /^SH-\d{8}-\d{6}$/);
});
