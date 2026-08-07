# Deployment Guide

The brief contains inconsistent wording between deployment and responsive-design marks. The safest final submission includes both a responsive application and live deployment.

## Suggested architecture
- MongoDB Atlas database.
- Node/Express API on a Node-compatible hosting service.
- React/Vite frontend on a static hosting service.

## Backend environment
Set these privately on the hosting platform:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_PRIVATE_ATLAS_URI_WITH_STYLEHAVEN_DATABASE
SESSION_SECRET=LONG_RANDOM_SECRET
SESSION_COOKIE_NAME=stylehaven.sid
CLIENT_URL=https://YOUR_FRONTEND_DOMAIN
SESSION_STORE=mongo
SERVE_CLIENT=false
```

Production cookies require HTTPS and the correct CORS frontend origin.

## Frontend environment

```env
VITE_API_URL=https://YOUR_API_DOMAIN/api
```

Run `npm run build` and deploy `client/dist`.

## Deployment checks
- API health endpoint loads.
- Frontend routes refresh without 404 errors.
- Signup, login, logout and session refresh work.
- Select a size and colour and add it to the bag.
- Checkout reduces the exact variant stock.
- Cancellation restores it.
- Administrator dashboard and CRUD work.
- Mobile layout works in a real browser.
- README contains live URLs and demo credentials.

Do not expose the Atlas password, session secret or `server/.env`.
