const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const loadUser = asyncHandler(async (req, _res, next) => {
  if (!req.session?.user?.id) return next();
  const user = await User.findById(req.session.user.id);
  if (!user || user.status !== 'active') {
    req.session.user = null;
    return next();
  }
  req.user = user;
  return next();
});
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Please log in to continue.' });
  return next();
}
function allowRoles(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Please log in to continue.' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    return next();
  };
}
module.exports = { loadUser, requireAuth, allowRoles };
