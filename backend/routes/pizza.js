const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/pizza — Get all available pizzas (logged in users can see this)
router.get('/', protect, async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/pizza — Add a new pizza (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// The pizza customization options (these could also come from DB)
router.get('/options', protect, (req, res) => {
  res.json({
    bases: ['Thin Crust', 'Thick Crust', 'Cheese Burst', 'Whole Wheat', 'Gluten Free'],
    sauces: ['Tomato', 'BBQ', 'White Garlic', 'Pesto', 'Buffalo'],
    cheeses: ['Mozzarella', 'Cheddar', 'Parmesan', 'Vegan Cheese'],
    veggies: ['Mushroom', 'Bell Pepper', 'Onion', 'Olives', 'Corn', 'Jalapeño', 'Spinach', 'Tomato']
  });
});

module.exports = router;