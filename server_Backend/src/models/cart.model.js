import db from '../config/db.js';

class Cart {

  static getByCustomer(customerId, callback) {

    db.query(
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
      [customerId],
      callback
    );

  }

  static add(customerId, productId, quantity, callback) {

    db.query(
      `
      SELECT *
      FROM cart
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [customerId, productId],
      (err, results) => {

        if (err) {
          return callback(err);
        }

        if (results.length > 0) {

          db.query(
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
            ],
            callback
          );

        } else {

          db.query(
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
            ],
            callback
          );

        }

      }
    );

  }

  static updateQuantity(
    customerId,
    productId,
    quantity,
    callback
  ) {

    db.query(
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
      ],
      callback
    );

  }

  static remove(
    customerId,
    productId,
    callback
  ) {

    db.query(
      `
      DELETE FROM cart
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [
        customerId,
        productId
      ],
      callback
    );

  }

  static clear(
    customerId,
    callback
  ) {

    db.query(
      `
      DELETE FROM cart
      WHERE customer_id = ?
      `,
      [customerId],
      callback
    );

  }

}

export default Cart;