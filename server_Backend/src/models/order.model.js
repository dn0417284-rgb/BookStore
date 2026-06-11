import db from "../config/db.js";

class Order {
  static create(order, callback) {
    db.getConnection((err, connection) => {
      if (err) {
        return callback(err);
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

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
          items,
        } = order;

        connection.query(
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
            payment_method || "COD",
            address_id || null,
          ],
          (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            const orderId = result.insertId;

            const insertItems = (index) => {
              if (index >= items.length) {
                return connection.commit((err) => {
                  connection.release();

                  if (err) {
                    return callback(err);
                  }

                  callback(null, orderId);
                });
              }

              const item = items[index];

              console.log(item);

              connection.query(
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
                  item.price * item.quantity,
                ],
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      callback(err);
                    });
                  }

                  insertItems(index + 1);
                },
              );
            };

            insertItems(0);
          },
        );
      });
    });
  }

  static getAll(callback) {
    db.query(
      `
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
      `,
      (err, orders) => {
        if (err) {
          return callback(err);
        }

        if (orders.length === 0) {
          return callback(null, []);
        }

        let completed = 0;

        orders.forEach((order) => {
          db.query(
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
            [order.order_id],
            (err, items) => {
              if (err) {
                return callback(err);
              }

              order.items = items;

              completed++;

              if (completed === orders.length) {
                callback(null, orders);
              }
            },
          );
        });
      },
    );
  }

  static getByCustomerId(customerId, callback) {
    db.query(
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
      [customerId],
      (err, orders) => {
        if (err) {
          return callback(err);
        }

        if (orders.length === 0) {
          return callback(null, []);
        }

        let completed = 0;

        orders.forEach((order) => {
          db.query(
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
            [order.order_id],
            (err, items) => {
              if (err) {
                return callback(err);
              }

              order.items = items;

              completed++;

              if (completed === orders.length) {
                callback(null, orders);
              }
            },
          );
        });
      },
    );
  }

  static getOrderDetail(orderId, customerId, callback) {
    db.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = ?
      AND customer_id = ?
      `,
      [orderId, customerId],
      (err, orders) => {
        if (err) {
          return callback(err);
        }

        if (!orders.length) {
          return callback(null, null);
        }

        const order = orders[0];

        db.query(
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
            ON p.product_id =
            oi.product_id

          WHERE oi.order_id = ?
          `,
          [orderId],
          (err, items) => {
            if (err) {
              return callback(err);
            }

            order.items = items;

            callback(null, order);
          },
        );
      },
    );
  }

  static getOrderDetailAdmin(orderId, callback) {
    db.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = ?
      `,
      [orderId],
      (err, orders) => {
        if (err) {
          return callback(err);
        }

        if (!orders.length) {
          return callback(null, null);
        }

        const order = orders[0];

        db.query(
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
          [orderId],
          (err, items) => {
            if (err) {
              return callback(err);
            }

            order.items = items;

            callback(null, order);
          },
        );
      },
    );
  }

  static async getAllOrders() {
    const sql = `
    SELECT
      order_id,
      order_code,
      tracking_code,
      customer_name,
      phone,
      total_amount,
      status,
      payment_status,
      created_at
    FROM orders
    ORDER BY created_at DESC
  `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static updateOrderStatus(orderId, status, callback) {
    db.query(
      `
      UPDATE orders
      SET status = ?
      WHERE order_id = ?
      `,
      [status, orderId],
      callback,
    );
  }

  static cancelOrder(orderId, customerId, callback) {
    db.query(
      `
      SELECT status
      FROM orders
      WHERE order_id = ?
      AND customer_id = ?
      `,
      [orderId, customerId],
      (err, rows) => {
        if (err) {
          return callback(err);
        }

        if (!rows.length) {
          return callback(new Error("KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng"));
        }

        if (rows[0].status !== "PENDING") {
          return callback(
            new Error("Chá»‰ Ä‘Æ°á»£c há»§y Ä‘Æ¡n Ä‘ang chá» xÃ¡c nháº­n"),
          );
        }

        db.query(
          `
          UPDATE orders
          SET status = 'CANCELLED'
          WHERE order_id = ?
          `,
          [orderId],
          callback,
        );
      },
    );
  }
}

export default Order;
