// models/auth.model.js
const db = require('../config/db');

const AuthModel = {
  // Tìm customer theo email (dùng cho login)
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM customers WHERE email = ? LIMIT 1';
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Tạo customer mới (dùng cho register)
  create: ({ full_name, email, password, phone, address }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO customers (full_name, email, password, phone, address, role, account_status, warning_count)
        VALUES (?, ?, ?, ?, ?, 'customer', 'active', 0)
      `;
      db.query(sql, [full_name, email, password, phone || null, address || null], (err, result) => {
        if (err) return reject(err);
        resolve({ customer_id: result.insertId, full_name, email, role: 'customer' });
      });
    });
  },

  // Kiểm tra email đã tồn tại chưa
  emailExists: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT customer_id FROM customers WHERE email = ? LIMIT 1';
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  },
};

module.exports = AuthModel;