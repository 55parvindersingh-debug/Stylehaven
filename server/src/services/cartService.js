const mongoose = require('mongoose');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { cartLineId, normaliseSize, normaliseColor, roundMoney } = require('../utils/helpers');
const { cartTotals } = require('../utils/pricing');

function sessionLines(req) { if (!Array.isArray(req.session.cart)) req.session.cart = []; return req.session.cart; }
function activeCouponQuery(code, now = new Date()) { return { code: String(code || '').trim().toUpperCase(), active: true, $and: [{ $or: [{ startsAt: null }, { startsAt: { $lte: now } }] }, { $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }] }, { $expr: { $or: [{ $eq: ['$usageLimit', 0] }, { $lt: ['$usedCount', '$usageLimit'] }] } }] }; }
function findVariant(product, size, color) { return (product.variants || []).find((variant) => variant.size === size && variant.color === color); }
async function calculateCart(req) {
  const lines = sessionLines(req);
  const productIds = [...new Set(lines.map((line) => String(line.productId)).filter((id) => mongoose.isValidObjectId(id)))];
  const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).populate('category', 'name slug').lean() : [];
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const validLines=[]; const items=[];
  for (const line of lines) {
    const product=byId.get(String(line.productId)); if (!product || product.status !== 'active') continue;
    const quantity=Math.max(1,Math.min(20,Number.parseInt(line.quantity,10)||1));
    const size=normaliseSize(line.size); const color=normaliseColor(line.color);
    const variant=findVariant(product,size,color); if (!variant) continue;
    const id=cartLineId(product._id,size,color);
    validLines.push({ lineId:id, productId:String(product._id), size, color, quantity });
    items.push({ lineId:id, product:{ id:String(product._id), sku:product.sku, slug:product.slug, name:product.name, image:product.image, price:product.price, stock:product.stock, category:product.category, sizes:product.sizes, colors:product.colors }, variantSku:variant.sku, size, color, quantity, lineTotal:roundMoney(product.price*quantity), variantStock:variant.stock, stockAvailable:variant.stock>=quantity });
  }
  req.session.cart=validLines;
  const preliminarySubtotal=roundMoney(items.reduce((sum,item)=>sum+item.lineTotal,0));
  let coupon=null;
  if (req.session.couponCode) { coupon=await Coupon.findOne(activeCouponQuery(req.session.couponCode)).lean(); if (!coupon || preliminarySubtotal<coupon.minimumSpend) { req.session.couponCode=null; coupon=null; } }
  const totals=cartTotals(items.map((item)=>item.lineTotal),coupon);
  return { items, itemCount:items.reduce((sum,item)=>sum+item.quantity,0), ...totals, coupon:coupon?{code:coupon.code,description:coupon.description,value:coupon.value,discountType:coupon.discountType}:null };
}
async function addItem(req,{productId,size,color,quantity=1}) {
  const qty=Number.parseInt(quantity,10); if (!Number.isInteger(qty)||qty<1||qty>20) throw Object.assign(new Error('Quantity must be a whole number between 1 and 20.'),{status:400});
  if (!mongoose.isValidObjectId(productId)) throw Object.assign(new Error('Invalid product identifier.'),{status:400});
  const product=await Product.findOne({_id:productId,status:'active'}); if (!product) throw Object.assign(new Error('This product is not available.'),{status:404});
  const selectedSize=normaliseSize(size); const selectedColor=normaliseColor(color);
  if (!selectedSize || !selectedColor) throw Object.assign(new Error('Please choose both a size and colour.'),{status:400});
  const variant=findVariant(product,selectedSize,selectedColor); if (!variant) throw Object.assign(new Error('The selected size and colour combination is not available.'),{status:400});
  const lineId=cartLineId(product._id,selectedSize,selectedColor); const lines=sessionLines(req); const existing=lines.find((line)=>line.lineId===lineId); const requested=(existing?.quantity||0)+qty;
  if (requested>variant.stock) throw Object.assign(new Error(`Only ${variant.stock} item(s) are available in ${selectedSize}, ${selectedColor}.`),{status:409});
  if (existing) existing.quantity=requested; else lines.push({lineId,productId:String(product._id),size:selectedSize,color:selectedColor,quantity:qty});
  return calculateCart(req);
}
async function updateItem(req,lineId,{quantity}) { const qty=Number.parseInt(quantity,10); if(!Number.isInteger(qty)||qty<1||qty>20) throw Object.assign(new Error('Quantity must be a whole number between 1 and 20.'),{status:400}); const line=sessionLines(req).find((item)=>item.lineId===lineId); if(!line) throw Object.assign(new Error('Cart item not found.'),{status:404}); const product=await Product.findById(line.productId).lean(); if(!product||product.status!=='active') throw Object.assign(new Error('This product is no longer available.'),{status:409}); const variant=findVariant(product,line.size,line.color); if(!variant) throw Object.assign(new Error('This size and colour combination is no longer available.'),{status:409}); if(qty>variant.stock) throw Object.assign(new Error(`Only ${variant.stock} item(s) are currently available.`),{status:409}); line.quantity=qty; return calculateCart(req); }
async function removeItem(req,lineId){req.session.cart=sessionLines(req).filter((item)=>item.lineId!==lineId);return calculateCart(req);}
async function applyCoupon(req,code){const cart=await calculateCart(req);const coupon=await Coupon.findOne(activeCouponQuery(code)).lean();if(!coupon)throw Object.assign(new Error('Coupon code is invalid, expired or has reached its usage limit.'),{status:400});if(cart.subtotal<coupon.minimumSpend)throw Object.assign(new Error(`This coupon requires a minimum spend of £${coupon.minimumSpend.toFixed(2)}.`),{status:400});req.session.couponCode=coupon.code;return calculateCart(req);}
function clearCart(req){req.session.cart=[];req.session.couponCode=null;}
module.exports={calculateCart,addItem,updateItem,removeItem,applyCoupon,clearCart,activeCouponQuery};
