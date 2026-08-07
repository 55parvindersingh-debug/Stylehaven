function isEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()); }
function isStrongEnoughPassword(value) { return typeof value === 'string' && value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value); }
function requiredString(value, min = 1, max = Infinity) {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= min && length <= max;
}
function parseNonNegativeNumber(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
function parsePositiveInteger(value, fallback = null) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function escapeRegex(value) { return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
module.exports = { isEmail, isStrongEnoughPassword, requiredString, parseNonNegativeNumber, parsePositiveInteger, slugify, escapeRegex };
