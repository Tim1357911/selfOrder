const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

class Order {
  static getAll() {
    const orders = db.prepare(`
      SELECT * FROM orders ORDER BY created_at DESC
    `).all();
    
    return orders.map(order => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getById(id) {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (order) {
      order.items = this.getOrderItems(id);
    }
    return order;
  }

  static getByStatus(status) {
    const orders = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at ASC').all(status);
    return orders.map(order => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getActiveOrders() {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE status NOT IN ('completed', 'cancelled') 
      ORDER BY created_at ASC
    `).all();
    
    return orders.map(order => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getKitchenOrders() {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE payment_status = 'paid' AND status IN ('paid', 'processing', 'ready')
      ORDER BY created_at ASC
    `).all();
    
    return orders.map(order => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getOrderItems(orderId) {
    return db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
  }

  static create({ customer_name, table_number, items, total_price }) {
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO orders (id, customer_name, table_number, total_price, status, payment_status)
      VALUES (?, ?, ?, ?, 'waiting_payment', 'pending')
    `).run(id, customer_name, table_number, total_price);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_id, menu_name, quantity, price, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(id, item.menu_id, item.menu_name, item.quantity, item.price, item.note || null);
    }

    return this.getById(id);
  }

  static updateStatus(id, status) {
    db.prepare(`
      UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, id);
    return this.getById(id);
  }

  static updatePaymentStatus(id, payment_status) {
    const status = payment_status === 'paid' ? 'paid' : 'waiting_payment';
    db.prepare(`
      UPDATE orders SET payment_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(payment_status, status, id);
    return this.getById(id);
  }

  static setQrisCode(id, qris_code) {
    db.prepare('UPDATE orders SET qris_code = ? WHERE id = ?').run(qris_code, id);
  }

  static cancel(id) {
    const order = this.getById(id);
    if (order && ['waiting_payment', 'paid', 'processing'].includes(order.status)) {
      db.prepare(`
        UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(id);
      return this.getById(id);
    }
    return null;
  }

  static getTodayOrders() {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE date(created_at) = date('now')
      ORDER BY created_at DESC
    `).all();
    
    return orders.map(order => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getTodayStats() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
      FROM orders 
      WHERE date(created_at) = date('now')
    `).get();
    return stats;
  }
}

module.exports = Order;
