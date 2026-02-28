
<div align="center">

# ◆ MAISON APPLE

### A premium Apple products store — built from scratch with the MERN stack

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

> Minimal aesthetic. Maximum performance.  
> A full-stack e-commerce platform with role-based staff panels, real-time order tracking, and MongoDB-backed operations.

<br/>

</div>

---

## ✦ What is this?

Maison Apple is a full-stack e-commerce store for Apple products. It features a clean minimalist storefront for customers, a powerful admin dashboard, and dedicated panels for store staff, warehouse workers, and couriers — each with their own role and workflow.

Everything is connected: React frontend → Express REST API → MongoDB. Orders flow through the system from placement to delivery, with every step handled by the right person.

---

## ✦ Live Architecture

```
  Customer                  Staff
     │                        │
     ▼                        ▼
  React (Vite)           Role Panels
     │                 /admin  /store-staff
     │                 /warehouse-staff  /courier
     │                        │
     └──────────┬─────────────┘
                ▼
         Express REST API
                │
         ┌──────┴──────┐
         │             │
      MongoDB      Winston Logs
    (Mongoose)    (morgan + files)
```

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| State | Context API (Auth, Cart, Favorites) |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Logging | Winston, Morgan |
| Dev Tools | Nodemon, dotenv |

---

## ✦ Features

### 🛍️ Storefront
- Product catalog with live search, category filter, sort by price/name
- Product detail pages with specs, color, stock status
- Favorites — saved per user in MongoDB
- Shopping cart — synced with MongoDB in real time
- Full checkout flow:
  - **Shipping** — address, ZIP, country, delivery notes, card payment
  - **Pickup from iSpace** — select city → select store → confirm

### 🔐 Authentication
- Register & Login with JWT tokens (7-day expiry)
- Protected routes with role-based access
- Auto-redirect to role panel on login
- Token stored in `localStorage`, verified on every request

### 📦 Order System

**Pickup flow:**
```
  [Customer places order]
         │
      accepting          ← Store Staff sees it
         │
       ready             ← Staff prepares the order
         │
      completed          ← Staff hands over to customer
```

**Shipping flow:**
```
  [Customer places order]
         │
       pending           ← Warehouse Staff sees it
         │
      sending            ← Warehouse ships to courier
         │
      delivered          ← Courier marks as delivered
```

---

## ✦ Staff Roles & Panels

| Role | Login Email | Panel URL | Responsibility |
|------|-------------|-----------|----------------|
| 👤 Customer | any | `/profile` | Browse, buy, track orders |
| 🔧 Admin | `admin@maison.com` | `/admin` | All orders, stats, pickup ID lookup |
| 🏪 Store Staff | `store@maison.com` | `/store-staff` | Pickup order management |
| 📦 Warehouse | `warehouse@maison.com` | `/warehouse-staff` | Shipping order processing |
| 🚚 Courier | `courier@maison.com` | `/courier` | In-transit delivery |

> Roles are assigned automatically based on email at registration.

---

## ✦ Admin Dashboard

The admin panel includes:
- **Stats** — total orders, pending, pickup count, shipping count, total revenue
- **All Orders** — filterable by status, shows delivery type, customer info, items
- **Pickup Identification** — search by email or order ID to verify and hand over orders
- **Status Control** — change any order status directly from the panel

---

## ✦ REST API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login, returns JWT |
| `GET` | `/api/auth/me` | ✓ | Get current user |
| `PATCH` | `/api/auth/me` | ✓ | Update profile |
| `POST` | `/api/auth/favorites/:id` | ✓ | Toggle favorite |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | — | All products (filterable) |
| `GET` | `/api/products/:id` | — | Single product |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart` | ✓ | Get user's cart |
| `POST` | `/api/cart` | ✓ | Add item to cart |
| `PATCH` | `/api/cart/:productId` | ✓ | Update quantity |
| `DELETE` | `/api/cart/:productId` | ✓ | Remove item |
| `DELETE` | `/api/cart` | ✓ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/orders` | ✓ | Create order |
| `GET` | `/api/orders` | ✓ | User's own orders |
| `GET` | `/api/orders/:id` | ✓ | Single order |
| `GET` | `/api/orders/staff/all` | Staff | All orders |
| `PATCH` | `/api/orders/staff/:id/status` | Staff | Update status |
| `GET` | `/api/orders/admin/all` | Admin | All orders (admin) |
| `GET` | `/api/orders/admin/lookup` | Admin | Lookup by email/ID |
| `PATCH` | `/api/orders/admin/:id/status` | Admin | Force status change |

### Stores
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stores/cities` | All cities with iSpace stores |
| `GET` | `/api/stores/:city` | Stores in a specific city |

---

## ✦ Data Models

<details>
<summary><b>Product</b></summary>

```js
{
  name: String,
  category: String,       // iphone | macbook | ipad | accessories
  price: Number,
  image: String,
  description: String,
  specs: [String],
  inStock: Boolean,
  color: String
}
```
</details>

<details>
<summary><b>User</b></summary>

```js
{
  name: String,
  email: String,
  password: String,       // bcrypt hashed
  role: String,           // user | admin | store_staff | warehouse_staff | courier
  favorites: [ObjectId],  // ref: Product
  createdAt: Date
}
```
</details>

<details>
<summary><b>Cart</b></summary>

```js
{
  user: ObjectId,         // ref: User
  items: [{
    product: ObjectId,    // ref: Product
    quantity: Number
  }]
}
```
</details>

<details>
<summary><b>Order</b></summary>

```js
{
  user: ObjectId,
  items: [{ product, quantity, price }],
  total: Number,
  status: String,         // pending | accepting | ready | sending | delivered | completed | cancelled
  deliveryType: String,   // shipping | pickup
  shipping: {
    name, email, phone, address, city, zip, country, notes
  },
  pickup: {
    storeId, storeName, storeAddress, city, phone, hours
  },
  createdAt: Date
}
```
</details>

---

## ✦ Project Structure

```
maison-apple/
│
├── front/                          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Home/
│       │   ├── Catalog/
│       │   ├── ProductDetail/
│       │   ├── Cart/
│       │   ├── Checkout/
│       │   ├── Profile/
│       │   ├── Favorites/
│       │   ├── Login/
│       │   ├── Register/
│       │   ├── About/
│       │   ├── Admin/
│       │   ├── StoreStaff/
│       │   ├── WarehouseStaff/
│       │   └── CourierStaff/
│       ├── components/
│       │   ├── ProductCard/
│       │   ├── Header/
│       │   ├── Footer/
│       │   └── PrivateRoute/
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── FavoritesContext.jsx
│       ├── hooks/
│       │   └── useSearch.js
│       └── layouts/
│           ├── MainLayout.jsx
│           └── AdminLayout.jsx
│
└── back/                           # Express backend
    ├── models/
    │   ├── Product.js
    │   ├── User.js
    │   ├── Cart.js
    │   └── Order.js
    ├── routes/
    │   ├── products.js
    │   ├── auth.js
    │   ├── cart.js
    │   ├── orders.js
    │   └── stores.js
    ├── logs/                       # Winston log files
    ├── logger.js
    ├── server.js
    └── .env
```

---

## ✦ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Community Server running on `localhost:27017`
- (Optional) MongoDB Compass for visual database management

### 1. Clone the repo

```bash
git clone https://github.com/saiduapov48-beep/said.git
cd said
```

### 2. Start MongoDB

```cmd
mkdir C:\data\db
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### 3. Start the backend

```bash
cd back
npm install
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 4. Start the frontend

```bash
cd front
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Create staff accounts

Register at `/register` using these emails — roles are assigned automatically:

| Email | Role |
|-------|------|
| `admin@maison.com` | Admin |
| `store@maison.com` | Store Staff |
| `warehouse@maison.com` | Warehouse Staff |
| `courier@maison.com` | Courier |

---

## ✦ Environment Variables

Create `back/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/maison-apple
JWT_SECRET=your_secret_key
```

---

## ✦ What I Built & What Claude Helped With

### Built by me
- Full project concept and design vision
- React pages: Home, Catalog, ProductDetail, Cart, Checkout, Profile, Favorites, About
- Staff panels: StoreStaff, WarehouseStaff, CourierStaff UI and CSS
- Checkout form with card formatting, validation, store selector
- MongoDB Compass setup and data management
- All product data (10 Apple products)
- Express server setup with ES modules and dotenv
- MongoDB connection and all Mongoose models
- Full REST API: products, auth, cart, orders, stores routes
- JWT authentication middleware (`requireAuth`, `requireAdmin`, `requireRole`)
- Role-based access system with auto-redirect on login
- Admin dashboard with stats, order management, pickup identification
- Order status flow design for pickup and shipping
- Staff panel architecture and role separation
- Winston + Morgan logging setup
- Bug fixes across contexts, routes, and component logic

---

<div align="center">

**Maison Apple** — built with React + Express + MongoDB

</div>
