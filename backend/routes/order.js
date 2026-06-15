const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { protect, adminOnly } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ─── CREATE RAZORPAY ORDER ─────────────────────────────────────────────────
router.post('/create-payment', protect, async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount } = req.body;
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    res.json(razorpayOrder);
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
});

// ─── VERIFY PAYMENT AND PLACE ORDER ───────────────────────────────────────
router.post('/place', protect, async (req, res) => {
  try {
    const {
      pizzaBase, sauce, cheese, veggies, totalPrice,
      paymentId, razorpayOrderId, razorpaySignature
    } = req.body;

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create order in DB
    const order = await Order.create({
      user: req.user._id,
      pizzaBase, sauce, cheese, veggies, totalPrice,
      paymentId, razorpayOrderId
    });

    // Update inventory
    const ingredientsToUpdate = [
      { category: 'base', name: pizzaBase },
      { category: 'sauce', name: sauce },
      { category: 'cheese', name: cheese },
      ...veggies.map(v => ({ category: 'veggie', name: v }))
    ];

    for (const item of ingredientsToUpdate) {
      const inventoryItem = await Inventory.findOne({
        category: item.category,
        name: item.name
      });

      if (inventoryItem) {
        inventoryItem.quantity -= 1;
        await inventoryItem.save();

        if (inventoryItem.quantity < inventoryItem.threshold) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `⚠️ Low Stock Alert: ${item.name}`,
            html: `
              <h2>Low Stock Alert</h2>
              <ul>
                <li><strong>Item:</strong> ${item.name}</li>
                <li><strong>Category:</strong> ${item.category}</li>
                <li><strong>Stock:</strong> ${inventoryItem.quantity} units</li>
                <li><strong>Threshold:</strong> ${inventoryItem.threshold} units</li>
              </ul>
            `
          });
        }
      }
    }

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET USER'S ORDERS ─────────────────────────────────────────────────────
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: GET ALL ORDERS ─────────────────────────────────────────────────
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: UPDATE ORDER STATUS ────────────────────────────────────────────
router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    await sendEmail({
      to: order.user.email,
      subject: 'Your Pizza Order Status Update',
      html: `
        <h2>Hi ${order.user.name}!</h2>
        <p>Your order status: <strong style="color:#e63946">${status}</strong></p>
        <p>Base: ${order.pizzaBase} | Sauce: ${order.sauce} | Cheese: ${order.cheese}</p>
        <p>Veggies: ${order.veggies.join(', ') || 'None'}</p>
      `
    });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;