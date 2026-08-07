const crypto = require('crypto');
function makeCustomerId() { return `CUS-${new Date().getFullYear()}-${crypto.randomInt(100000, 999999)}`; }
function makeOrderReference() { const date = new Date().toISOString().slice(0,10).replaceAll('-',''); return `SH-${date}-${crypto.randomInt(100000,999999)}`; }
function roundMoney(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }
function normaliseOption(value, max = 40) { const option = String(value || '').trim().replace(/\s+/g,' ').slice(0,max); return /^[A-Za-z0-9 .+\-/–]+$/.test(option) ? option : ''; }
function normaliseSize(value) { return normaliseOption(value, 30); }
function normaliseColor(value) { return normaliseOption(value, 40); }
function cartLineId(productId, size, color) { return `${String(productId)}:${normaliseSize(size) || 'ONE'}:${normaliseColor(color) || 'AS-SHOWN'}`; }
function booleanValue(value, fallback = false) { if (typeof value === 'boolean') return value; if (value === 'true' || value === '1' || value === 1) return true; if (value === 'false' || value === '0' || value === 0) return false; return fallback; }
module.exports = { makeCustomerId, makeOrderReference, roundMoney, normaliseSize, normaliseColor, cartLineId, booleanValue };
