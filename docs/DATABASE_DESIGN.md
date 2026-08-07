# Database Design, Justification and Assumptions

## Collections

### users
Stores authentication and profile details: `customerId`, name, email, bcrypt password, phone, role, status, address and wishlist product references.

**Justification:** one central user collection supports authentication and role-based access without duplicating customer details in every feature.

### categories
Stores collection name, slug, description, image, display order and status.

**Relationship:** Product → Category using a required ObjectId reference.

**Justification:** category details are written once and populated into product responses. Renaming a collection does not require editing every product.

### products
Stores base SKU, name, slug, category reference, audience, brand, material, description, care instructions, price, images, rating, aggregate stock and status.

Products embed `variants` containing:
- unique variant SKU
- size
- colour
- stock
- sold quantity

**Justification:** size/colour variants belong exclusively to one product and are updated together with that product. Embedding permits an atomic positional update for the exact variant during checkout. Aggregate stock is retained for fast catalogue and low-stock queries and is updated in the same transaction.

### orders
References the customer and stores order-item product references. Each item also stores a historical snapshot of SKU, name, image, price, size and colour.

**Justification:** references support relationships and analytics, while snapshots preserve the original order even if a product is later renamed or repriced.

### coupons
Stores code, discount type/value, minimum spend, validity dates, usage limit/count and active state.

**Justification:** coupon rules are validated by the server rather than trusted from the browser.

### reviews
References customer and product, with name, rating, text and moderation status.

### contactmessages
Optionally references a logged-in customer and stores contact details, topic, message and workflow status.

### newsletters
Stores unique email subscriptions and subscription status.

### sessions
Created automatically by `connect-mongo`. Session records contain the authenticated user session, shopping bag and coupon code.

## Relationship summary

```text
Category 1 ─────< Product
User 1 ─────────< Order
User >──────────< Product (wishlist references)
Product 1 ──────< Review
User 1 ─────────< Review
User 1 ─────────< ContactMessage (optional)
Product 1 ──────< embedded Variant
```

## Constraints and indexes
- Unique user email.
- Sparse unique customer ID.
- Unique category slug.
- Unique product base SKU and slug.
- Unique coupon code.
- Unique order reference.
- Unique newsletter email.
- Product text index for search.
- Status/category/stock indexes for filters and analytics.
- Schema enums constrain roles, statuses and discount types.
- Non-negative integer validation for stock and sold quantities.
- Rating constrained from 0 to 5.

## Stock transaction

Checkout performs one MongoDB transaction:
1. Re-read the session bag using current database records.
2. Verify exact size/colour variant stock.
3. Atomically decrement embedded variant stock and aggregate product stock.
4. Increment variant and aggregate sold quantity.
5. Create the linked order.
6. Increment coupon usage, if applicable.
7. Commit all operations together.

If any operation fails, the transaction rolls back. Eligible cancellation performs the reverse update once and sets `stockRestored: true`.

## Assumptions
1. StyleHaven is an academic demonstration store; no real payments are processed.
2. Prices are stored in GBP.
3. One product may have many size/colour variants.
4. Every orderable product has at least one variant.
5. Aggregate product stock equals the sum of variant stock.
6. A customer can place multiple orders.
7. A pending or processing order may be cancelled; shipped/delivered orders cannot be customer-cancelled.
8. Delivery is £4.99 below £75 and free from £75.
9. Administrator can deactivate records instead of physically deleting important history.
10. The supplied images may be reused by several demonstration products where D1 did not provide an individual image for every expanded record.
