const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const QRCode = require('qrcode');

// Generate QRIS for order
router.post('/generate-qris/:orderId', async (req, res) => {
  try {
    const order = Order.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate dynamic QRIS (simulated)
    // In production, this would integrate with actual payment gateway
    const qrisData = {
      merchantName: 'Coffee Shop',
      orderId: order.id,
      amount: order.total_price,
      timestamp: Date.now()
    };
    
    const qrisString = JSON.stringify(qrisData);
    const qrisCode = await QRCode.toDataURL(qrisString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    Order.setQrisCode(order.id, qrisCode);
    
    res.json({ 
      orderId: order.id,
      amount: order.total_price,
      qrisCode 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate payment verification (auto-validation)
// In production, this would be a webhook from payment gateway
router.post('/verify/:orderId', (req, res) => {
  try {
    const order = Order.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update payment status
    const updatedOrder = Order.updatePaymentStatus(req.params.orderId, 'paid');
    
    // Broadcast payment success
    const broadcast = req.app.get('broadcast');
    if (broadcast) {
      broadcast('all', { 
        type: 'PAYMENT_SUCCESS', 
        order: updatedOrder,
        orderId: updatedOrder.id 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Payment verified',
      order: updatedOrder 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check payment status
router.get('/status/:orderId', (req, res) => {
  try {
    const order = Order.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ 
      orderId: order.id,
      paymentStatus: order.payment_status,
      orderStatus: order.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate payment callback (for demo purposes)
router.post('/simulate-payment/:orderId', async (req, res) => {
  try {
    const order = Order.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Simulate 2 second delay for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update payment status
    const updatedOrder = Order.updatePaymentStatus(req.params.orderId, 'paid');
    
    // Broadcast payment success
    const broadcast = req.app.get('broadcast');
    if (broadcast) {
      broadcast('all', { 
        type: 'PAYMENT_SUCCESS', 
        order: updatedOrder,
        orderId: updatedOrder.id 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Payment successful (simulated)',
      order: updatedOrder 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
