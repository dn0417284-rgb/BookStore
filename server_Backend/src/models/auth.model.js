import db from '../config/db.js'; 

const AuthModel = {
  findByEmail: async (Email) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE Email = ?', [Email]);
      return rows[0]; 
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const { Email, MatKhau, HoTen, SoDienThoai, DiaChi } = userData;
      const query = `
        INSERT INTO users (Email, MatKhau, HoTen, SoDienThoai, DiaChi) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [Email, MatKhau, HoTen, SoDienThoai, DiaChi]);
      return result.insertId; 
    } catch (error) {
      throw error;
    }
  }
};

export default AuthModel;