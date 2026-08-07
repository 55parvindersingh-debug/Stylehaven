# API Reference

Base URL locally: `http://localhost:5000/api`

## Authentication
- `GET /auth/me`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `PUT /auth/profile`
- `PUT /auth/password`

## Products and collections
- `GET /products`
- `GET /products/:identifier`
- `POST /products` — admin
- `PUT /products/:id` — admin
- `DELETE /products/:id` — admin soft deactivation
- `GET /categories`
- `POST /categories` — admin
- `PUT /categories/:id` — admin
- `DELETE /categories/:id` — admin

Product query parameters include `search`, `category`, `brand`, `featured`, `sort`, `page` and `limit`.

## Session shopping bag
- `GET /cart`
- `POST /cart/items` with `productId`, `size`, `color`, `quantity`
- `PUT /cart/items/:lineId`
- `DELETE /cart/items/:lineId`
- `POST /cart/coupon`
- `DELETE /cart/coupon`
- `DELETE /cart`

## Wishlist
- `GET /wishlist`
- `POST /wishlist/:productId`
- `DELETE /wishlist/:productId`

## Orders
- `POST /orders/checkout`
- `GET /orders/mine`
- `PATCH /orders/mine/:id/cancel`
- `GET /orders` — admin
- `PATCH /orders/:id/status` — admin

## Other records
- Reviews: `/reviews`
- Contact messages: `/contact`
- Newsletter: `/newsletter`
- Coupons: `/coupons`
- Users: `/users`
- Dashboard: `/dashboard`

All protected endpoints use the MongoDB-backed session cookie. Administrator endpoints also enforce role authorization on the server.
