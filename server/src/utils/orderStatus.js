const transitions = {
  pending: new Set(['processing', 'cancelled']),
  processing: new Set(['shipped', 'cancelled']),
  shipped: new Set(['delivered']),
  delivered: new Set(),
  cancelled: new Set(),
};
function canTransitionOrderStatus(current, next) { return current === next || Boolean(transitions[current]?.has(next)); }
module.exports = { canTransitionOrderStatus, transitions };
