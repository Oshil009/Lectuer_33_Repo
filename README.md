# ShopNow — E-Commerce Platform

<div align="center">

![ShopNow](https://img.shields.io/badge/ShopNow-E--Commerce-0f172a?style=for-the-badge&logo=shopify&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**A full-stack e-commerce web application** built with React + Node.js/Express, featuring product browsing, cart management, order placement, reviews, favorites, and a full admin dashboard.

🌐 **[Live Frontend](https://shopnow01.vercel.app)** &nbsp;|&nbsp; ⚙️ **[Live Backend API](https://my-app-backend-161j.onrender.com)**

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Role & Permissions System](#role--permissions-system)
- [Email Notifications](#email-notifications)
- [Deployment](#deployment)

---

## Features

### 🛍️ Customer
- Browse and search products with category filtering and pagination
- View detailed product pages with image gallery and reviews
- Add products to cart and adjust quantities
- Save products to a favorites list
- Place orders with shipping address — with **auto-detect location** via GPS + Nominatim API
- Receive email confirmation upon order placement
- View order history with status tracking
- Manage profile (name, email, password)
- Reset password with a **visual strength meter** (Weak / Fair / Good / Strong)

### 🛠️ Admin
- Full product management (create, edit, delete)
- Category management
- User management (view all users, delete)
- Order management with status updates: `pending → processing → shipped → delivered → cancelled`
- Role management with custom permissions

### 🔐 General
- JWT-based authentication (2-hour expiry)
- Google OAuth 2.0 sign-in
- Responsive design (mobile + desktop)
- Security headers on all responses

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| React Router DOM | 7 | Client-side routing |
| Redux Toolkit + RTK Query | 2 | State management & API calls |
| React Redux | 9 | Redux bindings |
| Tailwind CSS | 4 | Utility-first styling |
| React Helmet Async | 3 | Dynamic `<head>` tags per page |
| SweetAlert2 | 11 | Toast notifications & confirm dialogs |
| Axios | 1 | HTTP client (used for Geolocation/Nominatim API) |
| Vite | 8 | Build tool & dev server |

### Backend

| Package | Version | Purpose |
|---|---|---|
| Express | 4 | HTTP server & routing |
| Mongoose | 7 | MongoDB ODM |
| bcrypt | 6 | Password hashing |
| jsonwebtoken | 9 | JWT creation & verification |
| Passport + passport-google-oauth20 | 0.7 / 2 | Google OAuth 2.0 |
| Nodemailer | 8 | Order confirmation emails |
| Slugify | 1 | Auto-generate URL slugs for products |
| dotenv | 17 | Environment variable loading |
| cors | 2 | Cross-origin request handling |
| nodemon | 3 | Dev auto-restart |

### Database
- **MongoDB Atlas** — cloud-hosted NoSQL database

---

## Project Structure

```
Lectuer_33_Repo/
├── BackEnd/
│   ├── config/
│   │   └── passport.js           # Google OAuth strategy
│   ├── controllers/
│   │   ├── userController.js     # Register, login, profile, favorites
│   │   ├── productController.js  # CRUD for products
│   │   ├── categoryController.js
│   │   ├── cartController.js     # Add, remove, clear cart
│   │   ├── orderController.js    # Place order, send email, view orders
│   │   ├── reviewController.js   # Add, edit, delete reviews
│   │   └── RoleController.js     # Admin role management
│   ├── middleware/
│   │   ├── auth.js               # JWT verification → req.user
│   │   └── authorizeRole.js      # Role-based access control
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── cart.js
│   │   ├── review.js
│   │   ├── category.js
│   │   ├── Role.js
│   │   └── db.js                 # MongoDB connection
│   ├── routers/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRouter.js
│   │   ├── cartRouter.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRouter.js
│   │   └── RoleRouter.js
│   ├── utils/
│   │   └── sendEmail.js          # Nodemailer email helper
│   ├── .env
│   ├── package.json
│   └── server.js                 # App entry point
│
└── FrontEnd/
    ├── public/
    │   ├── favicon.svg          # Custom app icon (SVG)
    │   ├── icons.svg            # Shared icon sprite
    │   ├── robots.txt
    │   └── _redirects           # Fallback SPA redirect rule
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx           # Product listing, search, filter, pagination
    │   │   ├── ProductDetail.jsx  # Product page with reviews
    │   │   ├── Cart.jsx           # Cart + checkout form + auto-detect location
    │   │   ├── Orders.jsx         # Order history
    │   │   ├── Favorites.jsx      # Saved products
    │   │   ├── Footer.jsx         # Site footer with links, socials, developer info
    │   │   ├── Profile.jsx        # User profile & settings
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ResetPassword.jsx  # Password change with strength meter
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AuthCallback.jsx   # Handles Google OAuth redirect
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── AuthProvider.jsx   # Stores user + token in session/localStorage
    │   │   └── useAuth.js
    │   ├── redux/
    │   │   └── store.js           # RTK Query slice registration
    │   ├── services/              # RTK Query API slices
    │   │   ├── userApiSlice.js
    │   │   ├── productApiSlice.js
    │   │   ├── categoryApiSlice.js
    │   │   ├── cartApiSlice.js
    │   │   ├── orderApiSlice.js
    │   │   ├── reviewApiSlice.js
    │   │   └── roleApiSlice.js
    │   ├── utils/
    │   │   ├── geoUtils.js        # Geolocation helper — GPS + Nominatim reverse geocoding
    │   │   └── swal.js            # SweetAlert2 toast & confirm helpers
    │   ├── App.jsx
    │   ├── App.css                # Global component styles
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── index.html
    ├── vercel.json                # Vercel SPA rewrite rule
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A MongoDB Atlas account (or local MongoDB)
- A Gmail account with an App Password (for email sending)
- A Google Cloud project with OAuth 2.0 credentials *(optional, for Google login)*

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Lectuer_33_Repo
```

### 2. Setup the Backend

```bash
cd BackEnd
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then:

```bash
npm run dev    # development — nodemon auto-restart
# or
npm start      # production
```

> Server starts at `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd FrontEnd
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Then:

```bash
npm run dev      # development → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

---

## Environment Variables

### BackEnd `.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `SALT_ROUNDS` | bcrypt salt rounds | `10` |
| `JWT_ACCESS_SECRET` | Secret key for signing JWTs | any long random string |
| `SMTP_USER` | Gmail address for sending emails | `you@gmail.com` |
| `SMTP_PASS` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | `https://my-app-backend-161j.onrender.com/user/auth/google/callback` |
| `FRONTEND_URL` | Frontend origin for CORS & redirects | `https://shopnow01.vercel.app` |

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail". Use the 16-character password (spaces are fine).

### FrontEnd `.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `https://my-app-backend-161j.onrender.com` |

---

## API Reference

All endpoints return JSON in the format:

```json
{ "success": true, "message": "...", "data": {} }
```

Protected routes require the header:

```
Authorization: Bearer <token>
```

---

### Auth & Users — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/user/register` | Public | Register a new user |
| `POST` | `/user/login` | Public | Login → returns `token` + `data` |
| `GET` | `/user/profile` | 🔒 User | Get current user's profile |
| `PUT` | `/user/profile` | 🔒 User | Update profile (name, email, etc.) |
| `PUT` | `/user/change-password` | 🔒 User | Change password |
| `POST` | `/user/favorite/:productId` | 🔒 User | Toggle product in favorites |
| `GET` | `/user/` | 🔒 Admin | Get all users (paginated) |
| `DELETE` | `/user/:id` | 🔒 Admin | Delete a user |
| `GET` | `/user/auth/google` | Public | Redirect to Google login |
| `GET` | `/user/auth/google/callback` | Public | Google OAuth callback |

**Register body:**
```json
{ "name": "Ahmad", "email": "ahmad@example.com", "password": "123456" }
```

**Login response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "data": { "_id": "...", "name": "Ahmad", "email": "...", "role": {} }
}
```

---

### Products — `/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products/` | Public | Get all products |
| `GET` | `/products/:id` | Public | Get product by ID or slug |
| `GET` | `/products/category/:categoryId` | Public | Get products by category |
| `POST` | `/products/` | 🔒 Admin | Create a new product |
| `PUT` | `/products/:id` | 🔒 Admin | Update a product |
| `DELETE` | `/products/:id` | 🔒 Admin | Delete a product |

**Create product body:**
```json
{
  "name": "Laptop Pro",
  "description": "High performance laptop",
  "price": 999,
  "categoryId": "<category_id>",
  "stock": 20,
  "imagesUrl": ["https://..."]
}
```

---

### Categories — `/category`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/category/` | Public | Get all categories |
| `POST` | `/category/` | 🔒 Admin | Create category |
| `PUT` | `/category/:id` | 🔒 Admin | Update category |
| `DELETE` | `/category/:id` | 🔒 Admin | Delete category |

---

### Cart — `/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart/` | 🔒 User | Get current user's cart |
| `POST` | `/cart/add` | 🔒 User | Add item (or increase qty) |
| `POST` | `/cart/remove` | 🔒 User | Remove item from cart |
| `DELETE` | `/cart/clear` | 🔒 User | Empty the entire cart |

**Add to cart body:**
```json
{ "productId": "<id>", "quantity": 2 }
```

---

### Orders — `/order`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/order/` | 🔒 User | Place an order (clears cart + sends email) |
| `GET` | `/order/my` | 🔒 User | Get current user's orders |
| `GET` | `/order/:id` | 🔒 User | Get a single order by ID |
| `GET` | `/order/` | 🔒 Admin | Get all orders (paginated) |
| `PATCH` | `/order/:id/status` | 🔒 Admin | Update order status |

**Place order body:**
```json
{
  "items": [{ "productId": "<id>", "quantity": 2 }],
  "shippingAddress": {
    "city": "Amman",
    "street": "King Abdullah St",
    "phone": "0791234567"
  }
}
```

**Order statuses:** `pending` → `processing` → `shipped` → `delivered` / `cancelled`

---

### Reviews — `/review`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/review/` | 🔒 User | Add a review |
| `GET` | `/review/product/:productId` | Public | Get all reviews for a product |
| `PUT` | `/review/:id` | 🔒 User | Edit own review |
| `DELETE` | `/review/:id` | 🔒 User/Admin | Delete review |

**Add review body:**
```json
{ "productId": "<id>", "rating": 5, "comment": "Great product!" }
```

---

### Roles — `/role`

All role routes require `🔒 Admin`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/role/` | Get all roles |
| `POST` | `/role/` | Create a role |
| `PUT` | `/role/:id` | Update a role |
| `DELETE` | `/role/:id` | Delete a role |

---

## Database Models

### User
```
name        String     required
email       String     required, unique, lowercase
password    String     hashed with bcrypt (auto on save)
googleId    String     null for email/password users
avatar      String     Google profile photo URL
role        ObjectId   → Role
favorites   [ObjectId] → Product[]
timestamps  createdAt, updatedAt
```

> **Note:** If no role is set on register, the middleware automatically assigns the default `user` role.

### Product
```
name        String    required, lowercase
description String    required
price       Number    required, min 0
categoryId  ObjectId  → Category
stock       Number    required, min 0
imagesUrl   [String]  array of image URLs
slug        String    auto-generated from name (unique)
createdBy   ObjectId  → User
timestamps  createdAt, updatedAt
```

### Order
```
user            ObjectId → User
items           [{ productId, quantity, price }]
totalPrice      Number   calculated server-side (not trusted from client)
status          Enum     pending | processing | shipped | delivered | cancelled
shippingAddress { city, street, phone }
timestamps      createdAt, updatedAt
```

### Cart
```
userId  ObjectId → User
items   [{ productId, quantity }]
```

### Review
```
productId  ObjectId → Product
userId     ObjectId → User
rating     Number   1–5
comment    String
timestamps createdAt, updatedAt
```

### Role
```
role         String    e.g. "admin", "user"
permissions  [String]  e.g. ["read", "write", "delete"]
```

---

## Authentication

The app uses **JWT (JSON Web Tokens)** with a 2-hour expiry.

### Flow

```
1. POST /user/login  →  server returns { token, data }
2. Frontend stores token in sessionStorage + localStorage
3. Every protected request sends:  Authorization: Bearer <token>
4. auth middleware verifies token → sets req.user = { id, type, permissions }
```

### JWT Payload

```json
{
  "id": "<user_id>",
  "type": "admin",
  "permissions": ["read", "write", "delete"]
}
```

> `email` and `name` are **not** included in the JWT payload. Use `GET /user/profile` to retrieve them, or fetch from the database inside controllers that need them (e.g. the order controller fetches the user by `req.user.id` to get the email for the confirmation message).

### Google OAuth Flow

```
1. User clicks "Sign in with Google"
2. GET /user/auth/google  →  redirects to Google
3. Google redirects to /user/auth/google/callback
4. Server creates or finds the user, signs a JWT
5. Redirects to: /auth/callback?token=<jwt>&user=<encoded_json>
6. AuthCallback.jsx reads params, calls login(), navigates to home
```

---

## Role & Permissions System

Roles are stored in MongoDB and assigned to users. The `authorizeRole` middleware checks `req.user.type` (from the JWT) against the required role.

```js
// Example: admin-only route
router.delete("/:id", auth, authorizeRole("admin"), deleteUser);
```

Default roles to seed in your database:

```json
[
  { "role": "user",  "permissions": ["read"] },
  { "role": "admin", "permissions": ["read", "write", "delete"] }
]
```

---

## Email Notifications

When an order is placed successfully, a confirmation email is sent to the customer using **Nodemailer** with Gmail.

The email is sent **asynchronously** — if it fails, the order is still saved and the cart is still cleared. The error is only logged to the console; the user is not affected.

### Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Go to **Security → App passwords**
3. Generate a password for "Mail"
4. Add to `.env`:
   ```env
   SMTP_USER=your@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

---

## Geolocation (Auto-detect Shipping Address)

When placing an order, users can click a **"Detect my location"** button in the cart checkout form. The app uses the browser's **Geolocation API** to get the user's GPS coordinates, then calls the **Nominatim reverse geocoding API** (OpenStreetMap) to resolve those coordinates into a human-readable address.

The logic lives in `src/utils/geoUtils.js` and populates the city, area, and street fields automatically.

> **Note:** This feature requires the user to allow location access in their browser. No API key is required — Nominatim is free and open-source.

---

## Deployment

### Backend — Render

1. Push `BackEnd/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add all environment variables from `.env`
6. Update `GOOGLE_CALLBACK_URL` to your Render service URL

### Frontend — Vercel

1. Push `FrontEnd/` to a GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Set **Framework Preset:** Vite
4. Set **Build Command:** `npm run build`
5. Set **Output Directory:** `dist`
6. Add environment variable: `VITE_API_URL=https://my-app-backend-161j.onrender.com`
7. The `vercel.json` file handles SPA routing automatically:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```

### After Deploying

- Update `FRONTEND_URL` in the backend `.env` to your Vercel URL
- Update `VITE_API_URL` in the frontend `.env` to your Render URL
- Update `GOOGLE_CALLBACK_URL` in the backend `.env` to your Render URL
- In Google Cloud Console, add both the callback URL and frontend URL to **Authorized origins / redirect URIs**