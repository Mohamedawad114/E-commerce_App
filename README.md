# 🛒 E-commerce API — Mini Amazon/Shopify

A **powerful RESTful API** for a complete e-commerce platform. It’s designed as a mini version of **Amazon** or **Shopify**, but with enterprise-like features: **admin/user roles, payments, queues, caching, analytics, Google OAuth2**, and much more.

---

## 🚀 Overview

This project is not just a basic e-commerce API — it’s built with **production-grade concepts** like:

* Role-based access (Admin/User)
* Stripe payments & refunds
* Redis for caching, banning, and queues
* BullMQ for background jobs (emails, notifications, auto-cancel orders)
* Node-cron for scheduled tasks
* Rate limiting for API protection
* Google OAuth2 authentication
* Admin dashboard reports & analytics

---

## ✨ Features

### 🔐 Authentication

* JWT authentication
* Google OAuth2 login
* phone encryption(Asymmatric)

### 👤 Users

* Register, login, update profile
* Ban/Unban via admin (stored in Redis)
* Delete user (admin only)

### 📦 Products & Categories

* Full CRUD (admin)
* Ratings & reviews (with average rating)
* Top-selling & top-rated products (aggregation + Redis cache)

### 🛒 Cart & Wishlist

* Add, update, remove items
* Manage wishlist

### 📑 Orders

* Create order (user)
* Cancel order (user/admin)
* Auto-cancel pending orders (BullMQ delayed jobs)
* Refund paid orders (Stripe refund)
* Order history per user

### 💳 Payments

* Stripe integration (PaymentIntent)
* Client secret for frontend checkout
* Webhooks for payment confirmation & refund tracking

### 🖥️ Admin Panel

* Ban/Unban users (Redis)
* Delete users
* Manage products/categories/orders
* Sales analytics (per day/month)
* Dashboard with **top products, revenue, order count**
* Rate limiting with Redis for security

### ⚙️ Background Jobs (BullMQ + Redis)

* `emailQueue` → send confirmation, cancellation, notification emails
* `notificationQueue` → app/push notifications
* `orderCancellationQueue` → auto-cancel pending orders after 4 days
* **node-cron** → schedule periodic tasks (daily reports)

---
📖 API Docs (Swagger)

Integrated with Swagger UI for interactive API documentation.

Endpoint: GET /api-docs

Swagger JSON: GET /api-docs/JSON

Helps test and explore endpoints directly in browser.
---
## 📊 Analytics

* **Orders per Day** → revenue + count
* **Orders per Month** → revenue + count
* **Top Rated Products** → highest avg rating
* **Top Selling Products** → most purchased

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB + Mongoose
* **Cache/Queues**: Redis + BullMQ
* **Auth**: JWT + Google OAuth2
* **Payments**: Stripe
* **Scheduler**: Node-cron
* **Security**: Rate limiting, validation, encrypted fields

---

## ⚡ Example Flow

1. User registers via email/password or Google.
2. Adds products to cart.
3. Creates an order → order stored as `pending`.
4. Stripe checkout → API returns `client_secret`.
5. Frontend confirms payment with Stripe.
6. Stripe webhook updates order status → `paid`.
7. BullMQ worker sends confirmation email + notification.
8. If still `pending` after 4 days → BullMQ auto-cancel job triggers.
9. Admin can view reports, ban users, or refund orders.

---

## 📂 Project Endpoints (Highlights)

* **Auth**: `/auth/register`, `/auth/login`, `/auth/google`
* **Users**: `/api/users/me`, `/api/admin/users/:id/ban`, `/api/admin/users/:id/unban`, `/api/admin/users/:id`
* **Products**: `/api/products`, `/api/products/topSelling`, `/api/products/topRating`
* **Orders**: `/api/orders`, `/api/userOrders/:id/cancel`, `/api/admin/orders/:id/cancel`
* **Analytics**: `/api/admin/orders/orderPerDay`, `/api/admin/orders/orderPerMonth`

---

## ⚙️ Environment Variables

```
PORT=3000
MONGODB_URI=...
JWT_SECRET=...
REDIS_URL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SERVER_URL=http://localhost:3000
EMAIL_HOST=...
EMAIL_USER=...
EMAIL_PASS=...
```

---

## ▶️ Running the Project

```bash
# Install dependencies
npm install

# Run API server\ nnpm run dev

# Start workers (queues)
node workers/emailWorker.js
node workers/orderCancellationWorker.js
```
---

## 🔒 Security & Production Notes

* Verify Stripe webhooks with secret
* Don’t store card details
* Use helmet + CORS
* Use Redis store for rate limiting
* Log admin actions (ban, delete, refund)
---
## 🚀 Deploy in AWS with Ngrok (Secure & Easy Access)

You can deploy this project on an AWS EC2 instance and expose it securely to the internet using **Ngrok**. This allows you to test your project from anywhere without configuring complex DNS or firewall rules.  

### Steps to Deploy

1. **Launch your EC2 instance**  
   - Ubuntu 22.04 LTS is recommended.  
   - Make sure the security group allows inbound traffic to your app port (default: `3000`).  

2. **Clone the project**  
   ```bash
   git clone https://github.com/Mohamedawad114/E-commerce_App.git
   cd E-commerce_App
 ---
 Ngrok provides a secure URL:
 https://2d3ff23c4d94.ngrok-free.app/

## 🎯 Conclusion

This project is a ** powerful e-commerce API**, inspired by Amazon/Shopify but simplified for learning and portfolio use. With features like **admin controls, Stripe payments, Redis caching, BullMQ queues, Google OAuth2, and advanced analytics**, it’s perfect for showcasing modern backend skills.

> 💡 Ideal for CV/portfolio: “Developed a production-grade E-commerce API with admin panel, payments, and background processing, inspired by Amazon/Shopify.”
