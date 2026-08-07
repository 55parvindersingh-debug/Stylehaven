# StyleHaven Database JSON

These JSON files contain the demonstration data required by the assignment:

- `users.json`
- `categories.json`
- `products.json`
- `coupons.json`
- `orders.json`
- `reviews.json`
- `contactmessages.json`
- `newsletters.json`

Import all datasets through:

```bash
npm run seed
```

The seed script clears these StyleHaven collections before importing the supplied records. MongoDB sessions are created automatically when the application runs.

After final testing, run `npm run export:db` so submitted JSON matches the final database state.
