const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const server = http.createServer(app);

// WebSocket setup for real-time updates
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const clientType = url.searchParams.get('type'); // 'customer', 'cashier', 'kitchen'
  const orderId = url.searchParams.get('orderId');
  
  const clientId = `${clientType}-${orderId || Date.now()}`;
  clients.set(clientId, { ws, type: clientType, orderId });
  
  console.log(`Client connected: ${clientId}`);
  
  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

// Broadcast function for real-time updates
const broadcast = (type, data) => {
  clients.forEach((client) => {
    if (client.ws.readyState === 1) { // WebSocket.OPEN
      if (type === 'all' || client.type === type || client.type === 'cashier' || client.type === 'kitchen') {
        client.ws.send(JSON.stringify(data));
      }
      // Send to specific order customer
      if (client.type === 'customer' && data.orderId === client.orderId) {
        client.ws.send(JSON.stringify(data));
      }
    }
  });
};

// Make broadcast available globally
app.set('broadcast', broadcast);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});

module.exports = { app, broadcast };
