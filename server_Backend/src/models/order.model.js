import db from "../config/db.js";

class Order {
  static async create(orderData) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const {
        customer_id,
        customer_name,
        phone,
        email,
        address,
        note,
        total_amount,
        items,
      } = orderData;

      const [orderResult] = await connection.query(
        `
        INSERT INTO orders
        (
          customer_id,
          customer_name,
          phone,
          email,
          address,
          note,
          total_amount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          customer_id,
          customer_name,
          phone,
          email || null,
          address,
          note || null,
          total_amount,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            quantity,
            price
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
          ]
        );
      }

      await connection.commit();

      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Order;