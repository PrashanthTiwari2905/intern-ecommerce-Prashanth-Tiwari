# 🛒 INDMart - Full Stack E-Commerce Platform

A modern full-stack e-commerce application built as an internship assignment. The project includes authentication, product management, cart and order management, product search, user profile, and a responsive user interface.

---

# 🚀 Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- User Profile Management

## Products
- Product Listing
- Product Details Page
- Pagination
- Product Search with Debouncing
- Category Filtering
- Responsive Product UI

## Cart
- Add to Cart
- Update Quantity
- Remove from Cart
- Cart Summary

## Orders
- Place Order
- Order History
- Order Details
- Checkout Flow

## User Profile
- View User Information
- Profile Management

## Backend Features
- REST API using NestJS
- JWT Authentication
- Prisma ORM
- PostgreSQL Database
- API Validation
- Swagger Documentation
- Modular Architecture
- Jest Unit Tests (Database Mocking)

---

# 🛠️ Tech Stack

## Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Axios
- React Hooks
- Context API

## Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger

## Database
- PostgreSQL

## Package Manager
- PNPM

---

# 📂 Project Structure

```text
intern-ecommerce-Prashanth-Tiwari
│
├── backend
│   ├── prisma
│   ├── src
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   ├── context
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

# ⚙️ Installation and Setup

## 1. Clone Repository

```bash
git clone https://github.com/PrashanthTiwari2905/intern-ecommerce-Prashanth-Tiwari.git

cd intern-ecommerce-Prashanth-Tiwari
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install Dependencies

```bash
pnpm install
```

## Create Environment File

Create `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
JWT_SECRET="your_jwt_secret"
PORT=3001
```

## Generate Prisma Client

```bash
pnpm prisma generate
```

## Run Database Migration

```bash
pnpm prisma migrate dev
```

## Seed Database (if available)

```bash
pnpm prisma db seed
```

## Start Backend Server

```bash
pnpm start:dev
```

Backend will run on:

```text
http://localhost:3001
```

Swagger Documentation:

```text
http://localhost:3001/api
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install Dependencies

```bash
pnpm install
```

## Create Environment File

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Start Frontend

```bash
pnpm dev
```

Frontend will run on:

```text
http://localhost:3000
```

---

# 🔐 Authentication APIs

## Register

```http
POST /auth/register
```

## Login

```http
POST /auth/login
```

## Profile

```http
GET /auth/profile
```

## Delete Profile (Soft Delete)

```http
DELETE /auth/profile
```

---

# 📦 Product APIs

## Get Products

```http
GET /products
```

## Get Product Details

```http
GET /products/:id
```

## Search Products

```http
GET /products?search=keyword
```

---

# 🛒 Cart APIs

```http
GET /cart
POST /cart
PATCH /cart/:id
DELETE /cart/:id
```

---

# 📋 Order APIs

```http
GET /orders
POST /orders
GET /orders/:id
```

---

# 🧩 Key Features Implemented

✅ Backend Stock Validation

✅ Soft Delete Profile

✅ Unit Testing with Jest & Database Mocking

✅ Authentication System

✅ JWT Authorization

✅ Product Management

✅ Product Search

✅ Pagination

✅ Shopping Cart

✅ Order Management

✅ Checkout Flow

✅ Responsive UI

✅ User Profile

✅ Swagger Documentation

---

# 🏗️ Architecture

```text
Frontend (Next.js)
        |
        |
        ▼
Backend API (NestJS)
        |
        |
        ▼
PostgreSQL Database
        |
        |
        ▼
Prisma ORM
```

---

# 📈 Future Improvements

- Payment Gateway Integration
- Wishlist Feature
- Product Reviews and Ratings
- Admin Dashboard
- Image Upload Support
- Email Notifications
- Order Tracking

---

# 👨‍💻 Author

**Prashanth Tiwari**

- GitHub: https://github.com/PrashanthTiwari2905
- LinkedIn: https://www.linkedin.com/in/prashanth-tiwari

---

#  Acknowledgements

This project was developed as part of a Full Stack Developer Internship Assignment and demonstrates end-to-end development using modern web technologies.

---