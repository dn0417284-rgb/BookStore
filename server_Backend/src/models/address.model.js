import db from '../config/db.js';

class Address {

  static async getAllByCustomerId(customerId) {
    const [rows] = await db.query(
      `
      SELECT *
      FROM customer_addresses
      WHERE customer_id = ?
      ORDER BY is_default DESC, address_id DESC
      `,
      [customerId]
    );

    return rows;
  }

  static async create(address) {
    const {
      customer_id,
      receiver_name,
      phone,
      province,
      district,
      ward,
      address_detail
    } = address;

    const [result] = await db.query(
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
      ]
    );

    return result;
  }

  static async checkDuplicate(
    customerId,
    province,
    district,
    ward,
    addressDetail
  ) {
    const [rows] = await db.query(
      `
      SELECT address_id
      FROM customer_addresses
      WHERE customer_id = ?
      AND province = ?
      AND district = ?
      AND ward = ?
      AND address_detail = ?
      LIMIT 1
      `,
      [
        customerId,
        province,
        district,
        ward,
        addressDetail
      ]
    );

    return rows;
  }

  static async update(
    addressId,
    customerId,
    address
  ) {
    const {
      receiver_name,
      phone,
      province,
      district,
      ward,
      address_detail
    } = address;

    const [result] = await db.query(
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
      ]
    );

    return result;
  }

  static async checkDuplicateForUpdate(
    addressId,
    customerId,
    province,
    district,
    ward,
    addressDetail
  ) {
    const [rows] = await db.query(
      `
      SELECT address_id
      FROM customer_addresses
      WHERE customer_id = ?
      AND province = ?
      AND district = ?
      AND ward = ?
      AND address_detail = ?
      AND address_id <> ?
      LIMIT 1
      `,
      [
        customerId,
        province,
        district,
        ward,
        addressDetail,
        addressId
      ]
    );

    return rows;
  }

  static async delete(
    addressId,
    customerId
  ) {
    const [result] = await db.query(
      `
      DELETE FROM customer_addresses
      WHERE address_id = ?
      AND customer_id = ?
      `,
      [
        addressId,
        customerId
      ]
    );

    return result;
  }

  static async setDefault(
    addressId,
    customerId
  ) {

    await db.query(
      `
      UPDATE customer_addresses
      SET is_default = FALSE
      WHERE customer_id = ?
      `,
      [customerId]
    );

    const [result] = await db.query(
      `
      UPDATE customer_addresses
      SET is_default = TRUE
      WHERE address_id = ?
      AND customer_id = ?
      `,
      [
        addressId,
        customerId
      ]
    );

    return result;
  }
}

export default Address;