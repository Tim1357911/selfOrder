const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get all menus
router.get('/', (req, res) => {
  try {
    const menus = Menu.getAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu categories
router.get('/categories', (req, res) => {
  try {
    const categories = Menu.getCategories();
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu by category
router.get('/category/:category', (req, res) => {
  try {
    const menus = Menu.getByCategory(req.params.category);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single menu
router.get('/:id', (req, res) => {
  try {
    const menu = Menu.getById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle menu availability
router.patch('/:id/toggle', (req, res) => {
  try {
    Menu.toggleAvailability(req.params.id);
    const menu = Menu.getById(req.params.id);
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
