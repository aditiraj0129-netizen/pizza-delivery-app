const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to a User document
    ref: 'User',
    required: true
  },
  pizzaBase: {
    type: String,
    required: true
  },
  sauce: {
    type: String,
    required: true
  },
  cheese: {
    type: String,
    required: true
  },
  veggies: [String],  // Array of strings e.g. ['Mushroom', 'Onion']
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    // Order goes through these stages in order
    enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
    default: 'Order Received'
  },
  paymentId: String,     // Razorpay payment ID
  razorpayOrderId: String // Razorpay order ID
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);