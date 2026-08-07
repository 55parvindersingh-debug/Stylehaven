const { roundMoney } = require('./helpers');
function deliveryFeeFor(subtotal) { const value = roundMoney(Math.max(0, Number(subtotal) || 0)); return value === 0 || value >= 75 ? 0 : 4.99; }
function discountFor(subtotal, coupon) { const value = roundMoney(Math.max(0, Number(subtotal) || 0)); if (!coupon) return 0; const raw = coupon.discountType === 'percentage' ? value * (Number(coupon.value) / 100) : Number(coupon.value); return roundMoney(Math.min(value, Math.max(0, Number(raw) || 0))); }
function cartTotals(lineTotals, coupon = null) { const subtotal = roundMoney((lineTotals || []).reduce((sum,value)=>sum+(Number(value)||0),0)); const deliveryFee=deliveryFeeFor(subtotal); const discount=discountFor(subtotal,coupon); return { subtotal, deliveryFee, discount, total: roundMoney(Math.max(0, subtotal + deliveryFee - discount)) }; }
module.exports = { deliveryFeeFor, discountFor, cartTotals };
