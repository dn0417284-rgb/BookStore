import db from '../config/db.js';

class Cart {

  static async getByCustomer(customerId) {

    const [rows] = await db.query(
      `
      SELECT
        c.product_id,
        c.quantity,
        p.title,
        p.author,
        p.price,
        p.image
      FROM cart c
      INNER JOIN products p
        ON p.product_id = c.product_id
      WHERE c.customer_id = ?
      `,
      [customerId]
    );

    return rows;
  }

  static async add(customerId, productId, quantity) {

    const [rows] = await db.query(
      `
      SELECT *
      FROM cart
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [customerId, productId]
    );

    if (rows.length > 0) {

      await db.query(
        `
        UPDATE cart
        SET quantity = quantity + ?
        WHERE customer_id = ?
        AND product_id = ?
        `,
        [
          quantity,
          customerId,
          productId
        ]
      );

    } else {

      await db.query(
        `
        INSERT INTO cart
        (
          customer_id,
          product_id,
          quantity
        )
        VALUES (?, ?, ?)
        `,
        [
          customerId,
          productId,
          quantity
        ]
      );

    }

    return await Cart.getByCustomer(customerId);
  }

  static async updateQuantity(
    customerId,
    productId,
    quantity
  ) {

    await db.query(
      `
      UPDATE cart
      SET quantity = ?
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [
        quantity,
        customerId,
        productId
      ]
    );

    return await Cart.getByCustomer(customerId);
  }

  static async remove(
    customerId,
    productId
  ) {

    await db.query(
      `
      DELETE FROM cart
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [
        customerId,
        productId
      ]
    );

    return await Cart.getByCustomer(customerId);
  }

  static async clear(customerId) {

    await db.query(
      `
      DELETE FROM cart
      WHERE customer_id = ?
      `,
      [customerId]
    );

    return true;
  }

}

export default Cart;