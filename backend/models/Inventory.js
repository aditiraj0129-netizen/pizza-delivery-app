const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    // These are the 4 categories you track
    enum: ['base', 'sauce', 'cheese', 'veggie'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 100  // Start with 100 units
  },
  threshold: {
    type: Number,
    default: 20  // Alert admin when below this number
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);