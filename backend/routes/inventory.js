const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/inventory — Admin can see all inventory
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/inventory/seed — Set up initial inventory data
// Run this once to populate the database
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    await Inventory.deleteMany({}); // Clear existing inventory

    const items = [
      // Bases
      { category: 'base', name: 'Thin Crust', quantity: 100, threshold: 20 },
      { category: 'base', name: 'Thick Crust', quantity: 100, threshold: 20 },
      { category: 'base', name: 'Cheese Burst', quantity: 100, threshold: 20 },
      { category: 'base', name: 'Whole Wheat', quantity: 100, threshold: 20 },
      { category: 'base', name: 'Gluten Free', quantity: 50, threshold: 10 },
      // Sauces
      { category: 'sauce', name: 'Tomato', quantity: 100, threshold: 20 },
      { category: 'sauce', name: 'BBQ', quantity: 100, threshold: 20 },
      { category: 'sauce', name: 'White Garlic', quantity: 100, threshold: 20 },
      { category: 'sauce', name: 'Pesto', quantity: 80, threshold: 15 },
      { category: 'sauce', name: 'Buffalo', quantity: 80, threshold: 15 },
      // Cheeses
      { category: 'cheese', name: 'Mozzarella', quantity: 100, threshold: 20 },
      { category: 'cheese', name: 'Cheddar', quantity: 100, threshold: 20 },
      { category: 'cheese', name: 'Parmesan', quantity: 80, threshold: 15 },
      { category: 'cheese', name: 'Vegan Cheese', quantity: 50, threshold: 10 },
      // Veggies
      { category: 'veggie', name: 'Mushroom', quantity: 200, threshold: 30 },
      { category: 'veggie', name: 'Bell Pepper', quantity: 200, threshold: 30 },
      { category: 'veggie', name: 'Onion', quantity: 200, threshold: 30 },
      { category: 'veggie', name: 'Olives', quantity: 150, threshold: 25 },
      { category: 'veggie', name: 'Corn', quantity: 150, threshold: 25 },
      { category: 'veggie', name: 'Jalapeño', quantity: 100, threshold: 20 },
      { category: 'veggie', name: 'Spinach', quantity: 100, threshold: 20 },
      { category: 'veggie', name: 'Tomato', quantity: 150, threshold: 25 },
    ];

    await Inventory.insertMany(items);
    res.json({ message: 'Inventory seeded successfully!', count: items.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/inventory/:id — Update stock quantity
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }  // Return the updated document
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;