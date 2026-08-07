# StyleHaven D2 Testing Checklist

## Installation and startup
- [ ] `npm install` completes.
- [ ] `npm run seed` imports all eight JSON datasets.
- [ ] `npm run dev` starts client and API.
- [ ] `/api/health` returns a success response.
- [ ] No browser console or server errors appear during normal use.

## Authentication and sessions
- [ ] Customer registration creates a unique customer ID and hashed password.
- [ ] Duplicate email is rejected.
- [ ] Correct login works; incorrect password fails.
- [ ] Session survives refresh.
- [ ] Logout destroys access to protected pages.
- [ ] Customer cannot access administrator routes.
- [ ] Inactive user cannot log in.

## Database population and reading
- [ ] Home featured products come from MongoDB.
- [ ] Shop loads 30 products and 4 collections.
- [ ] Search works for name, brand, material and colour.
- [ ] Collection and brand filters work.
- [ ] Price, rating and name sorting work.
- [ ] Invalid product route shows Product Not Found.
- [ ] Category names are populated instead of ObjectIds.

## Variants, bag and coupons
- [ ] Product page requires size and colour.
- [ ] Selected size and colour appear in the session bag.
- [ ] Same product in different variants creates separate lines.
- [ ] Same variant increases quantity.
- [ ] Quantity cannot exceed exact variant stock.
- [ ] Quantity update, remove and clear bag work.
- [ ] Bag survives page navigation and refresh.
- [ ] `STYLE10` and `WELCOME5` rules work.
- [ ] Invalid/expired coupon is rejected.
- [ ] Delivery is £4.99 below £75 and free at £75 or above.

## Checkout and database updates
- [ ] Empty bag cannot check out.
- [ ] Checkout requires login and valid address.
- [ ] Order record and reference are created.
- [ ] Exact variant stock reduces by purchased quantity.
- [ ] Aggregate product stock also reduces.
- [ ] Sold quantities increase.
- [ ] Session bag clears only after successful order.
- [ ] Failed checkout does not partially reduce stock.
- [ ] Eligible cancellation restores variant and aggregate stock once.
- [ ] Repeated cancellation does not restore twice.
- [ ] Delivered order cannot be cancelled by customer.

## Wishlist, reviews and profile
- [ ] Logged-in wishlist persists in MongoDB.
- [ ] Wishlist duplicate is prevented.
- [ ] Profile/address update persists.
- [ ] Password update requires current password.
- [ ] Review submission creates a pending record.
- [ ] Administrator approval makes review public.

## Administration CRUD
- [ ] Product create/edit/deactivate works.
- [ ] Variant lines and stock persist correctly.
- [ ] Collection create/edit/deactivate works.
- [ ] Coupon create/edit/deactivate works.
- [ ] Order status transition rules work.
- [ ] User role/status management works.
- [ ] Review, message and newsletter status management works.
- [ ] Dashboard metrics and aggregations load.

## Responsive and accessibility
- [ ] Logo, header and footer appear on all pages.
- [ ] Navigation works around 375px, 768px, 1024px and 1440px.
- [ ] Product grids, details, bag, checkout and dashboard do not overlap.
- [ ] Administrator tables remain usable through horizontal scrolling.
- [ ] Forms have labels, keyboard focus and useful error messages.
- [ ] Images include alternative text.

## Final technical checks
- [ ] `npm run check` passes.
- [ ] `npm test` passes.
- [ ] `npm run validate:data` passes.
- [ ] `npm run preflight` passes.
- [ ] `npm run build` passes.
- [ ] Live deployment works in incognito mode.
- [ ] Final clean ZIP works after extraction.
