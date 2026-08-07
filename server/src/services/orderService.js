const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { calculateCart, clearCart, activeCouponQuery } = require('./cartService');
const { makeOrderReference } = require('../utils/helpers');
async function createOrder(req,customer,shippingAddress,paymentMethod,notes='') {
  const cart=await calculateCart(req); if(!cart.items.length) throw Object.assign(new Error('Your shopping bag is empty.'),{status:400}); if(cart.items.some((item)=>!item.stockAvailable)) throw Object.assign(new Error('One or more bag items no longer have enough stock. Update the bag before checkout.'),{status:409});
  const session=await mongoose.startSession(); let createdOrder;
  try { await session.withTransaction(async()=>{
    for(const item of cart.items){const result=await Product.updateOne({_id:item.product.id,status:'active',variants:{$elemMatch:{size:item.size,color:item.color,stock:{$gte:item.quantity}}}},{$inc:{'variants.$.stock':-item.quantity,'variants.$.soldQuantity':item.quantity,stock:-item.quantity,soldQuantity:item.quantity}},{session});if(result.modifiedCount!==1)throw Object.assign(new Error(`${item.product.name} in ${item.size}, ${item.color} does not have enough stock.`),{status:409});}
    const docs=await Order.create([{orderReference:makeOrderReference(),customer:customer._id,items:cart.items.map((item)=>({product:item.product.id,sku:item.variantSku,name:item.product.name,image:item.product.image,size:item.size,color:item.color,quantity:item.quantity,unitPrice:item.product.price,lineTotal:item.lineTotal})),shippingAddress,paymentMethod,subtotal:cart.subtotal,deliveryFee:cart.deliveryFee,discount:cart.discount,total:cart.total,couponCode:cart.coupon?.code||'',notes}],{session});createdOrder=docs[0];
    if(cart.coupon?.code){const result=await Coupon.updateOne(activeCouponQuery(cart.coupon.code),{$inc:{usedCount:1}},{session});if(result.modifiedCount!==1)throw Object.assign(new Error('The selected coupon is no longer available. Please review your bag and try again.'),{status:409});}
  });} finally {await session.endSession();}
  clearCart(req); return createdOrder.populate('customer','fullName email customerId');
}
async function cancelOrder(order){if(order.status==='cancelled')return order;if(!['pending','processing'].includes(order.status))throw Object.assign(new Error('Only pending or processing orders can be cancelled.'),{status:409});const session=await mongoose.startSession();try{await session.withTransaction(async()=>{if(!order.stockRestored){for(const item of order.items){await Product.updateOne({_id:item.product,variants:{$elemMatch:{size:item.size,color:item.color}}},{$inc:{'variants.$.stock':item.quantity,'variants.$.soldQuantity':-item.quantity,stock:item.quantity,soldQuantity:-item.quantity}},{session});}}order.status='cancelled';order.stockRestored=true;await order.save({session});});}finally{await session.endSession();}return order;}
module.exports={createOrder,cancelOrder};
