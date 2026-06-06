const db = require('../config/db');

class Address {

  static getAllByCustomerId(
    customerId,
    callback
  ) {

    db.query(
      `
      SELECT *
      FROM customer_addresses
      WHERE customer_id = ?
      ORDER BY is_default DESC,
      address_id DESC
      `,
      [customerId],
      callback
    );

  }

  static create(
    address,
    callback
  ) {

    const {
      customer_id,
      receiver_name,
      phone,
      province,
      district,
      ward,
      address_detail
    } = address;

    db.query(
      `
      INSERT INTO customer_addresses
      (
        customer_id,
        receiver_name,
        phone,
        province,
        district,
        ward,
        address_detail
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer_id,
        receiver_name,
        phone,
        province,
        district,
        ward,
        address_detail
      ],
      callback
    );

  }

  static update(
    addressId,
    customerId,
    address,
    callback
  ) {

    const {
      receiver_name,
      phone,
      province,
      district,
      ward,
      address_detail
    } = address;

    db.query(
      `
      UPDATE customer_addresses
      SET
        receiver_name = ?,
        phone = ?,
        province = ?,
        district = ?,
        ward = ?,
        address_detail = ?
      WHERE address_id = ?
      AND customer_id = ?
      `,
      [
        receiver_name,
        phone,
        province,
        district,
        ward,
        address_detail,
        addressId,
        customerId
      ],
      callback
    );

  }

  static delete(
    addressId,
    customerId,
    callback
  ) {

    db.query(
      `
      DELETE FROM customer_addresses
      WHERE address_id = ?
      AND customer_id = ?
      `,
      [
        addressId,
        customerId
      ],
      callback
    );

  }

  static setDefault(
    addressId,
    customerId,
    callback
  ) {

    db.query(
      `
      UPDATE customer_addresses
      SET is_default = FALSE
      WHERE customer_id = ?
      `,
      [customerId],
      (err) => {

        if (err) {
          return callback(err);
        }

        db.query(
          `
          UPDATE customer_addresses
          SET is_default = TRUE
          WHERE address_id = ?
          AND customer_id = ?
          `,
          [
            addressId,
            customerId
          ],
          callback
        );

      }
    );

  }

}

module.exports = Address;