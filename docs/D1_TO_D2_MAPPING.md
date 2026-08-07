# StyleHaven D1 to D2 Mapping

| D1 feature | D2 implementation |
|---|---|
| Eleven static HTML pages | React routes and reusable components |
| D1 boutique colour palette, logo and images | Preserved in responsive React design |
| Twelve hard-coded products | Thirty MongoDB product records, retaining all original product concepts |
| Women, Men and Outerwear | Related collection records; Accessories promoted in D1 now has real products |
| `product.html?id=...` | Dynamic `/products/:identifier` route and API lookup |
| Invalid ID falls back to first product | Proper 404 Product Not Found response |
| S/M/L/XL interface | Exact size-and-colour variant records with variant SKU and stock |
| Selected size not saved in D1 cart | Session bag stores product + size + colour |
| Product-level display stock | Exact variant stock plus aggregate stock |
| localStorage cart | Express session shopping bag persisted by MongoDB session store |
| localStorage wishlist | User wishlist Product references in MongoDB |
| Demo checkout clears browser cart | Transaction creates order and reduces stock |
| No delivery calculation | £4.99 delivery below £75, otherwise free |
| Fake login/signup | bcrypt authentication, login/logout sessions and protected routes |
| Contact/newsletter demonstrations | MongoDB records and administrator workflows |
| Hard-coded ratings | Related customer reviews and moderation |
| No admin area | CRUD, fulfilment, customer management and analytics dashboard |
