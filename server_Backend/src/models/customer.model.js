import db from "../config/db.js";

// lấy dữ liệu từ database
const customerModel = {
  getCustomers: async () => {
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
  },
};

export default customerModel;
