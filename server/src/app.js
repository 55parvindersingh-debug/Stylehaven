const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const { loadUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.SERVE_CLIENT === 'true') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const allowedOrigins = String(process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean);
const corsMiddleware = cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by the CORS policy.'));
  }
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const host = req.headers.host;
    const originHost = origin.replace(/^https?:\/\//, '');
    if (originHost === host) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return next();
    }
  }
  return corsMiddleware(req, res, next);
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const crossSiteClient = isProduction && process.env.SERVE_CLIENT !== 'true';
if (isProduction && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) throw new Error('A SESSION_SECRET of at least 32 characters is required in production.');
const sessionOptions = {
  name: process.env.SESSION_COOKIE_NAME || 'stylehaven.sid',
  secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: crossSiteClient ? 'none' : 'lax', secure: isProduction, maxAge: 1000 * 60 * 60 * 24 * 7 },
};
if (process.env.MONGODB_URI && process.env.SESSION_STORE !== 'memory') {
  sessionOptions.store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions', ttl: 60 * 60 * 24 * 7, autoRemove: 'native' });
}
app.use(session(sessionOptions));
app.use(loadUser);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 80, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many authentication attempts. Please try again later.' } });
app.get('/api/health', (_req, res) => res.json({ status: 'ok', application: 'StyleHaven', timestamp: new Date().toISOString() }));
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use(notFound);
app.use(errorHandler);
module.exports = app;
