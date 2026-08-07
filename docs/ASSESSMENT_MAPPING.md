# Assessment Criteria Mapping

## Database design and relationships
- Eight application datasets plus MongoDB session collection.
- Product → Category, Order → User/Product, Review → User/Product and wishlist relationships.
- Embedded clothing variants with exact size/colour stock.
- Unique keys, enums, types, validation and indexes.
- Design justification and assumptions documented.

## Data populated to website
- Thirty products, four collections, five users, eight orders and supporting records.
- React pages read data through Express APIs.
- Mongoose `populate()` displays collection, customer and product details instead of raw IDs.
- Search, filtering, sorting, product details, order history and dashboard aggregations.

## Server-side code and database updates
- Node.js, Express and Mongoose.
- Registration, bcrypt login/logout and MongoDB-backed sessions.
- Server-side shopping bag, coupon and wishlist.
- CRUD for products, collections and coupons.
- Status updates for orders, users, reviews, messages and subscriptions.
- Checkout transaction reduces exact variant quantities.
- Cancellation restores quantities once.
- Validation, authorization, error middleware, helmet, CORS and rate limiting.

## Responsive design
- Logo, header and footer throughout.
- Mobile, tablet, laptop and desktop breakpoints.
- Responsive navigation, product grids, details, bag, checkout, forms, dashboard and tables.
- Labels, alternative text, focus states and status feedback.

## Submission evidence
- README with local/remote instructions and demo credentials.
- Restorable JSON database files.
- API, database, deployment, D1 mapping and testing documentation.
- One clean ZIP after final testing.
