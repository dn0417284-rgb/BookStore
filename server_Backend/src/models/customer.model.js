import db from "../config/db.js";

const customerModel = {
  getCustomers: async () => {
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
  },

  deleteCustomer: async (id) => {
    const [result] = await db.query(
      "DELETE FROM customers WHERE customer_id = ?",
      [id]
    );
    return result;
  },

  createCustomer: async (customer) => {
    const [result] = await db.execute(
      `INSERT INTO customers (email, full_name, password, phone, address)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer.email,
        customer.full_name,
        customer.password,
        customer.phone,
        customer.address
      ]
    );
    return result;
  },
  login: async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM customers WHERE email = ?",
    [email]
  );

  return rows[0];
}
};

export default customerModel;