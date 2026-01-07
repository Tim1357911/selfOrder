const db = require('../db/database');

class Menu {
  static getAll() {
    return db.prepare('SELECT * FROM menus WHERE is_available = 1 ORDER BY category, name').all();
  }

  static getById(id) {
    return db.prepare('SELECT * FROM menus WHERE id = ?').get(id);
  }

  static getByCategory(category) {
    return db.prepare('SELECT * FROM menus WHERE category = ? AND is_available = 1').all(category);
  }

  static getCategories() {
    return db.prepare('SELECT DISTINCT category FROM menus ORDER BY category').all();
  }

  static create({ name, category, price, description, image_url }) {
    const result = db.prepare(
      'INSERT INTO menus (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)'
    ).run(name, category, price, description, image_url);
    return result.lastInsertRowid;
  }

  static update(id, { name, category, price, description, image_url, is_available }) {
    return db.prepare(
      `UPDATE menus SET name = ?, category = ?, price = ?, description = ?, image_url = ?, is_available = ? WHERE id = ?`
    ).run(name, category, price, description, image_url, is_available ? 1 : 0, id);
  }

  static toggleAvailability(id) {
    return db.prepare('UPDATE menus SET is_available = NOT is_available WHERE id = ?').run(id);
  }
}

module.exports = Menu;
