import db from "../config/db.js";

// lấy dữ liệu khach hang
const customerModel = {
  getCustomers: async () => {
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
  },
  // xóa customer
  deleteCustomer: async (id) => {
    const [result] = await db.query(
      "DELETE FROM customers WHERE customer_id = ?",
      [id],
    );
    return result;
  },
};

export default customerModel;
