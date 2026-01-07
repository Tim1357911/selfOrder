const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Table = require('../models/Table');

// Get all tables
router.get('/', (req, res) => {
  try {
    const tables = Table.getAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table by number
router.get('/:tableNumber', (req, res) => {
  try {
    const table = Table.getByNumber(req.params.tableNumber);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate QR code for table
router.get('/:tableNumber/qr', async (req, res) => {
  try {
    const tableNumber = req.params.tableNumber;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/order?table=${tableNumber}`;
    
    const qrCode = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    Table.setQrCode(tableNumber, qrCode);
    
    res.json({ 
      tableNumber, 
      qrCode,
      url 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate all QR codes
router.get('/generate/all', async (req, res) => {
  try {
    const tables = Table.getAll();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const results = [];
    
    for (const table of tables) {
      const url = `${frontendUrl}/order?table=${table.table_number}`;
      const qrCode = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2
      });
      Table.setQrCode(table.table_number, qrCode);
      results.push({ tableNumber: table.table_number, qrCode, url });
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
