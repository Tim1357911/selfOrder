const db = require('../db/database');

class Table {
  static getAll() {
    return db.prepare('SELECT * FROM tables ORDER BY table_number').all();
  }

  static getByNumber(tableNumber) {
    return db.prepare('SELECT * FROM tables WHERE table_number = ?').get(tableNumber);
  }

  static setQrCode(tableNumber, qrCode) {
    return db.prepare('UPDATE tables SET qr_code = ? WHERE table_number = ?').run(qrCode, tableNumber);
  }

  static toggleActive(tableNumber) {
    return db.prepare('UPDATE tables SET is_active = NOT is_active WHERE table_number = ?').run(tableNumber);
  }
}

module.exports = Table;
