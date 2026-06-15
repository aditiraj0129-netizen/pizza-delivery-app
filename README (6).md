🍕 Pizza Delivery App

A full-stack pizza delivery web application built with React, Node.js, Express, and MongoDB.

![Pizza App Banner](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)


Live Demo

- Frontend:** 
- Backend API:
- <img width="265" height="269" alt="Screenshot 2026-06-15 at 7 18 56 AM" src="https://github.com/user-attachments/assets/ed0dc4fe-3f25-402f-a757-1d2b9af7a35f" />
<img width="276" height="227" alt="Screenshot 2026-06-15 at 7 19 12 AM" src="https://github.com/user-attachments/assets/d725acb2-0611-4210-b766-c89022852494" />

<img width="254" height="294" alt="Screenshot 2026-06-15 at 7 19 21 AM" src="https://github.com/user-attachments/assets/0632fec0-38b5-45f3-adb3-586393efe441" />
<img width="262" height="249" alt="Screenshot 2026-06-15 at 7 20 53 AM" src="https://github.com/user-attachments/assets/fba3cc09-722c-469d-b2c5-03516b8dc7b6" />
<img width="248" height="200" alt="Screenshot 2026-06-15 at 6 46 46 AM" src="https://github.com/user-attachments/assets/45e73fe2-2187-46d8-9603-27dd0a6f8ffc" />
<img width="256" height="270" alt="Screenshot 2026-06-15 at 7 21 24 AM" src="https://github.com/user-attachments/assets/bd997fc5-171c-41b8-bd3c-1f44522c0c15" />
<img width="264" height="232" alt="Screenshot 2026-06-15 at 6 45 45 AM" src="https://github.com/user-attachments/assets/b4452ca7-2f69-4c5d-9332-b63c4bbcc46e" />
<img width="241" height="283" alt="Screenshot 2026-06-15 at 5 45 24 AM" src="https://github.com/user-attachments/assets/5bdf43b5-3653-427d-a28c-a5c37262e1d5" />





---

 Features

 User Side
-  Register with email verification
-  Login / Forgot Password / Reset Password
-  Custom pizza builder — choose base, sauce, cheese & veggies
-  Razorpay payment gateway (test mode)
-  Real-time order tracking with live status updates
-  Email notifications on every status change

Admin Side
- View and manage all orders
-  Update order status (Order Received → In Kitchen → Sent to Delivery → Delivered)
-  Inventory management — track all ingredients
-  Automatic low stock email alerts

---
 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt.js |
| Payment | Razorpay API |
| Email | Nodemailer (Gmail SMTP) |
| Styling | Custom CSS |

---

Project Structure

```
pizza-delivery-app/
│
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Order.js         # Order schema
│   │   ├── Pizza.js         # Pizza schema
│   │   └── Inventory.js     # Inventory schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, verify, reset
│   │   ├── pizza.js         # Pizza options
│   │   ├── order.js         # Place order, payment, status
│   │   └── inventory.js     # Stock management
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── utils/
│   │   └── sendEmail.js     # Nodemailer helper
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Register.js
        │   ├── Login.js
        │   ├── VerifyEmail.js
        │   ├── ForgotPassword.js
        │   ├── ResetPassword.js
        │   ├── Dashboard.js
        │   ├── CustomizePizza.js
        │   ├── Checkout.js
        │   ├── MyOrders.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       ├── AdminOrders.js
        │       └── AdminInventory.js
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   └── Navbar.js
        ├── api.js
        ├── App.js
        └── index.css
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB installed locally OR MongoDB Atlas account
- Gmail account with App Password enabled
- Razorpay account (test mode is free)

---

 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pizza-delivery-app.git
cd pizza-delivery-app
```

---

2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/pizzaapp
JWT_SECRET=any_random_secret_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
RAZORPAY_KEY_ID=rzp_test_xxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxx
ADMIN_EMAIL=your_gmail@gmail.com
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
 Server running on port 8000
```

---

### 3. Create Admin User

```bash
node createAdmin.js
```

Admin credentials:
- Email: `admin@pizzaapp.com`
- Password: `Admin@123`

---

### 4. Seed Inventory

Login as admin in Thunder Client, then:
```
POST http://localhost:8000/api/inventory/seed
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 5. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxx
```

Start the frontend:
```bash
npm start
```

App opens at `http://localhost:3000`

---

## 💳 Test Payment Details

Use these in Razorpay test modal:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | `12/28` |
| CVV | `123` |
| Name | Any name |
 API Endpoints

 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password/:token` | Reset password |

 Pizza
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pizza/options` | Get customization options |
| GET | `/api/pizza` | Get all pizzas |

Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/create-payment` | Initiate Razorpay payment |
| POST | `/api/orders/place` | Verify & place order |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders/admin/all` | Admin: get all orders |
| PUT | `/api/orders/admin/:id/status` | Admin: update order status |

 Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Admin: view all stock |
| POST | `/api/inventory/seed` | Admin: seed default stock |
| PUT | `/api/inventory/:id` | Admin: update quantity |

---

 Deployment

### Backend → Render
1. Connect GitHub repo on [render.com](https://render.com)
2. Root directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Add all environment variables

Frontend → Vercel
1. Connect GitHub repo on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Add environment variables with your Render backend URL

---

Screenshots

> Add screenshots here after deployment

---

 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

 License

MIT License — feel free to use this project for learning or as a base for your own app.

---

 Author


