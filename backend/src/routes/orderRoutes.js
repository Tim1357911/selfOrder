const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's orders
router.get('/today', (req, res) => {
  try {
    const orders = Order.getTodayOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's statistics
router.get('/stats', (req, res) => {
  try {
    const stats = Order.getTodayStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active orders (for cashier)
router.get('/active', (req, res) => {
  try {
    const orders = Order.getActiveOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get kitchen orders
router.get('/kitchen', (req, res) => {
  try {
    const orders = Order.getKitchenOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', (req, res) => {
  try {
    const { customer_name, table_number, items, total_price } = req.body;
    
    if (!customer_name || !table_number || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = Order.create({ customer_name, table_number, items, total_price });
    
    // Broadcast new order to cashier and kitchen
    const broadcast = req.app.get('broadcast');
    if (broadcast) {
      broadcast('all', { type: 'NEW_ORDER', order });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['waiting_payment', 'paid', 'processing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = Order.updateStatus(req.params.id, status);
    
    // Broadcast status update
    const broadcast = req.app.get('broadcast');
    if (broadcast) {
      broadcast('all', { type: 'ORDER_STATUS_UPDATE', order, orderId: order.id });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.patch('/:id/cancel', (req, res) => {
  try {
    const order = Order.cancel(req.params.id);
    if (!order) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    
    // Broadcast cancellation
    const broadcast = req.app.get('broadcast');
    if (broadcast) {
      broadcast('all', { type: 'ORDER_CANCELLED', order, orderId: order.id });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
