const test = require('node:test');
const assert = require('node:assert/strict');
const { isEmail, isStrongEnoughPassword, requiredString, parsePositiveInteger, slugify, escapeRegex } = require('./validation');
test('validation accepts expected values and rejects malformed values', () => {
  assert.equal(isEmail('customer@example.com'), true);
  assert.equal(isEmail('bad'), false);
  assert.equal(isStrongEnoughPassword('Customer123!'), true);
  assert.equal(isStrongEnoughPassword('password'), false);
  assert.equal(requiredString(' StyleHaven ', 2, 20), true);
  assert.equal(parsePositiveInteger('3'), 3);
  assert.equal(parsePositiveInteger('0'), null);
});
test('slug and regex helpers produce safe values', () => {
  assert.equal(slugify("Burgundy Winter Coat"), 'burgundy-winter-coat');
  assert.equal(escapeRegex('ball.*'), 'ball\\.\\*');
});
