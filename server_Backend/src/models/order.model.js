import db from '../config/db.js';

class Order {

  static async create(order) {

    const connection =
      await db.getConnection();

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
        payment_method,
        address_id,
        items
      } = order;

      const [result] =
        await connection.query(
          `
          INSERT INTO orders
          (
            customer_id,
            customer_name,
            phone,
            email,
            address,
            note,
            total_amount,
            payment_method,
            address_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            customer_id,
            customer_name,
            phone,
            email || null,
            address,
            note || null,
            total_amount,
            payment_method || 'COD',
            address_id || null
          ]
        );

        const orderId =
          result.insertId;

        for (const item of items) {

          await connection.query(
            `
            INSERT INTO order_items
            (
              order_id,
              product_id,
              quantity,
              price,
              title,
              author,
              image,
              subtotal
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              orderId,
              item.product_id,
              item.quantity,
              item.price,
              item.title,
              item.author,
              item.image,
              item.price * item.quantity
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

  static async getAll() {

    const [orders] =
      await db.query(`
        SELECT
          o.order_id,
          o.customer_name,
          o.phone,
          o.email,
          o.address,
          o.note,
          o.total_amount,
          o.status,
          o.created_at
        FROM orders o
        ORDER BY o.order_id DESC
      `);

    for (const order of orders) {

      const [items] =
        await db.query(
          `
          SELECT
            oi.order_item_id,
            oi.quantity,
            oi.price,
            p.product_id,
            p.title,
            p.image
          FROM order_items oi
          INNER JOIN products p
            ON p.product_id = oi.product_id
          WHERE oi.order_id = ?
          `,
          [order.order_id]
        );

      order.items = items;

    }

    return orders;

  }

  static async getByCustomerId(customerId) {

    const [orders] = await db.query(
      `
      SELECT
        o.order_id,
        o.customer_id,
        o.customer_name,
        o.phone,
        o.email,
        o.address,
        o.note,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      WHERE o.customer_id = ?
      ORDER BY o.order_id DESC
      `,
      [customerId]
    );

    for (const order of orders) {

      const [items] = await db.query(
        `
        SELECT
          oi.order_item_id,
          oi.quantity,
          oi.price,
          p.product_id,
          p.title,
          p.image
        FROM order_items oi
        INNER JOIN products p
          ON p.product_id = oi.product_id
        WHERE oi.order_id = ?
        `,
        [order.order_id]
      );

      order.items = items;

    }

    return orders;

  }

  static async getOrderDetail(
    orderId,
    customerId
  ) {

    const [orders] = await db.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = ?
      AND customer_id = ?
      `,
      [
        orderId,
        customerId
      ]
    );

    if (!orders.length) {
      return null;
    }

    const order = orders[0];

    const [items] = await db.query(
      `
      SELECT
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.title,
        p.author,
        p.image
      FROM order_items oi
      INNER JOIN products p
        ON p.product_id = oi.product_id
      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    order.items = items;

    return order;

  } 

  static async getOrderDetailAdmin(
    orderId
  ) {

    const [orders] =
      await db.query(
        `
        SELECT *
        FROM orders
        WHERE order_id = ?
        `,
        [orderId]
      );

    if (!orders.length) {
      return null;
    }

    const order = orders[0];

    const [items] =
      await db.query(
        `
        SELECT
          oi.order_item_id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.title,
          p.author,
          p.image
        FROM order_items oi
        INNER JOIN products p
          ON p.product_id = oi.product_id
        WHERE oi.order_id = ?
        `,
        [orderId]
      );

    order.items = items;

    return order;

  }

  static async getAllOrders() {

    const [rows] =
      await db.query(`
        SELECT
          order_id,
          customer_name,
          phone,
          total_amount,
          status,
          created_at
        FROM orders
        ORDER BY created_at DESC
      `);

    return rows;

  }

  static async updateOrderStatus(
    orderId,
    status
  ) {

    const [result] =
      await db.query(
        `
        UPDATE orders
        SET status = ?
        WHERE order_id = ?
        `,
        [
          status,
          orderId
        ]
      );

    return result;

  }

  static async cancelOrder(
    orderId,
    customerId
  ) {

    const [rows] =
      await db.query(
        `
        SELECT status
        FROM orders
        WHERE order_id = ?
        AND customer_id = ?
        `,
        [
          orderId,
          customerId
        ]
      );

    if (!rows.length) {

      throw new Error(
        'Không tìm thấy đơn hàng'
      );

    }

    if (
      rows[0].status !== 'PENDING'
    ) {

      throw new Error(
        'Chỉ được hủy đơn đang chờ xác nhận'
      );

    }

    const [result] =
      await db.query(
        `
        UPDATE orders
        SET status = 'CANCELLED'
        WHERE order_id = ?
        `,
        [orderId]
      );

    return result;

  }

}


export default Order;