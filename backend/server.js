const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware — these lines run before every request
app.use(cors()); // Allow requests from React frontend
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', db: 'Connected' });
}); // Parse JSON request bodies

// Import all route files
const authRoutes = require('./routes/auth');
const pizzaRoutes = require('./routes/pizza');
const orderRoutes = require('./routes/order');
const inventoryRoutes = require('./routes/inventory');

// Register routes — all auth routes start with /api/auth, etc.
app.use('/api/auth', authRoutes);
app.use('/api/pizza', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Start the server only after DB connects
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  process.on('uncaughtException', err => {
  console.log(err);
});

  process.on('unhandledRejection', err => {
  console.log(err);
});