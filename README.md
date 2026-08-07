# StyleHaven — Online Clothing Store (CMP7246 Deliverable 2)

StyleHaven is a full-stack MERN application developed directly from the supplied StyleHaven Deliverable 1 project. It preserves the original boutique branding, local images, collections, product-details concept, cart, wishlist, login/signup pages and responsive visual direction. D2 replaces the D1 hard-coded browser array and localStorage simulations with React, Node.js, Express, MongoDB, secure sessions, related database records, CRUD operations, real order records and database stock updates.

> Academic demonstration: no real card details are requested and no real payment is processed.

## D2 functionality

### Public shopping journey
- Responsive home, shop, collections, offers, reviews, about and contact pages.
- Thirty MongoDB products, including all twelve original D1 product concepts.
- Four related collections: Women, Men, Outerwear and Accessories.
- Search by name, SKU, brand, description, material or colour.
- Filter by collection and brand; sort by rating, price or name.
- Dynamic product detail route with brand, material, care, sizes, colours, rating and live stock.
- Proper Product Not Found handling instead of falling back to the first item.
- MongoDB contact messages and newsletter subscriptions.

### Accounts and sessions
- Customer registration with unique customer ID.
- bcrypt password hashing.
- Login/logout using `express-session`.
- Sessions persisted in MongoDB through `connect-mongo`.
- Protected customer and administrator routes.
- Profile, address and password updates.

### Bag, variants, wishlist and orders
- Shopping bag stored in the Express session.
- Each bag line is uniquely identified by product + size + colour.
- Variant-level SKU, stock and sold quantity.
- Quantity update, remove item, clear bag and coupon operations.
- Logged-in wishlist stored as product references on the user record.
- Delivery is free at a £75 merchandise subtotal; otherwise £4.99.
- `STYLE10` gives 10% off qualifying bags; `WELCOME5` gives £5 off qualifying bags.
- Checkout re-reads database prices, coupon and exact size/colour stock.
- A MongoDB transaction creates the order and reduces exact variant and aggregate stock.
- Eligible cancellation restores exact variant stock once using `stockRestored` protection.
- Customer order history and status display.

### Administration
- Dashboard metrics for customers, active products, low stock, orders, revenue, reviews and messages.
- Product CRUD including material, care instructions and variant stock.
- Collection CRUD.
- Coupon CRUD.
- Order status management.
- Customer role/status management.
- Review moderation.
- Contact-message and newsletter management.

## Technology
- Frontend: React 19, React Router, Vite, responsive CSS.
- Backend: Node.js, Express 5, Mongoose.
- Database: MongoDB Atlas or local MongoDB.
- Sessions: express-session and connect-mongo.
- Security: bcryptjs, helmet, CORS, rate limiting, httpOnly cookies and environment variables.

## Project structure

```text
StyleHaven_D2_Complete/
├── client/                 React app and original D1 assets
├── server/                 API, models, routes, services and tools
├── database/               Restorable JSON data
├── docs/                   Design, API, deployment and assessment evidence
├── scripts/dev.js          Runs client and server together
├── README.md
├── START_HERE.txt
├── TESTING_CHECKLIST.md
└── SUBMISSION_CHECKLIST.md
```

## Prerequisites
- Node.js 20 or newer.
- npm.
- MongoDB Atlas account or local MongoDB.
- VS Code is recommended.

## Local installation

1. Extract the ZIP and open `StyleHaven_D2_Complete` in VS Code.
2. Open a terminal in the project root.
3. Install dependencies:

```bash
npm install
```

4. Copy `server/.env.example` to `server/.env`.
5. Replace `MONGODB_URI` with the private MongoDB Atlas URI. Keep database name `stylehaven`.
6. Replace `SESSION_SECRET` with a long random value of at least 32 characters.
7. Import the supplied data:

```bash
npm run seed
```

8. Start frontend and backend together:

```bash
npm run dev
```

9. Open the Vite address, normally `http://localhost:5173`.
10. API health check: `http://localhost:5000/api/health`.

## Environment example

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/stylehaven?retryWrites=true&w=majority
SESSION_SECRET=replace-with-a-long-random-secret-at-least-32-characters
SESSION_COOKIE_NAME=stylehaven.sid
CLIENT_URL=http://localhost:5173
SESSION_STORE=mongo
SERVE_CLIENT=false
```

Never include `server/.env` in the submitted ZIP.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@stylehaven.demo` | `Admin123!` |
| Customer | `customer@stylehaven.demo` | `Customer123!` |

## Database population

The supplied JSON contains:
- 5 users.
- 4 collections.
- 30 products with size/colour variants.
- 3 coupons.
- 8 orders.
- 10 reviews.
- 4 contact messages.
- 3 newsletter subscriptions.

Run `npm run seed` to restore it. Run `npm run export:db` after final testing to export current data.

## Database relationships
- Product references Category.
- Product embeds size/colour variants because each variant belongs only to its product and must be updated atomically with it.
- User wishlist contains Product references.
- Order references User and each order item references Product while keeping a historical snapshot of name, SKU, price, size and colour.
- Review references User and Product.
- ContactMessage optionally references User.
- Sessions are stored by connect-mongo.

Detailed justification and assumptions are in `docs/DATABASE_DESIGN.md`.

## Quality commands

```bash
npm run check
npm test
npm run validate:data
npm run preflight
npm run build
```

## Remote deployment

Deployment is intentionally completed using the student's own hosting and Atlas account. Follow `docs/DEPLOYMENT.md`, then replace these placeholders:

- Frontend URL: `ADD_AFTER_DEPLOYMENT`
- API URL: `ADD_AFTER_DEPLOYMENT`

The live application must be retested in an incognito browser before submission.

## Responsive design

All public, account, checkout and administration pages include desktop, tablet and phone layouts. Navigation collapses on small screens; product grids, forms, dashboards and tables adapt without removing core functionality. Logo, header and footer remain present throughout.

## D1 continuity

The D2 work is based on the supplied StyleHaven D1. The following were retained or expanded:
- StyleHaven name, logo, colour direction and local images.
- Women, Men and Outerwear products from D1.
- Accessories collection promoted in D1 is now backed by real records.
- Product details, size selection, wishlist and shopping bag.
- Search, filters, sorting, login/signup, contact and newsletter concepts.
- Responsive boutique presentation.

The exact mapping is documented in `docs/D1_TO_D2_MAPPING.md`.

## Submission

Submit one clean ZIP containing source code, README and database JSON. Do not include `.env`, Atlas credentials, `node_modules`, `.git` or temporary files. Test the ZIP from a fresh folder before uploading to Moodle.
