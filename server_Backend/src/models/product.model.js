import db from "../config/db.js";

// lấy dữ liệu sản phẩm
const productModel = {
  getProducts: async () => {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  },

  createProduct: async (product) => {
    const [result] = await db.query(
      `INSERT INTO products
      (title,sold, price, publisher, author, cover_type, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.title,
        product.sold,
        product.price,
        product.publisher,
        product.author,
        product.cover_type,
        product.description,
        product.image,
      ],
    );

    return result;
  },

  deleteProduct: async (id) => {
    const [result] = await db.query(
      "DELETE FROM products WHERE product_id = ?",
      [id],
    );

    return result;
  },

  updateProduct: async (id, product) => {
    const [result] = await db.query(
      `UPDATE products
       SET title = ?,
           sold = ?,
           price = ?,
           publisher = ?,
           author = ?,
           cover_type = ?,
           description = ?,
           image = ?
       WHERE product_id = ?`,
      [
        product.title,
        product.sold,
        product.price,
        product.publisher,
        product.author,
        product.cover_type,
        product.description,
        product.image,
        id,
      ],
    );

    return result;
  },
};

export default productModel;
