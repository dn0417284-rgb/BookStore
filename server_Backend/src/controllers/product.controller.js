import productService from "../services/product.service.js";
import productModel from "../models/product.model.js";
import fs from "fs";
const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await productModel.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  createProduct: async (req, res) => {
    try {
      const product = {
        ...req.body,
        image: null,
      };

      if (req.file) {
        const uploadDir = "uploads";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeFileName = Buffer.from(
          req.file.originalname,
          "latin1",
        ).toString("utf8");
        fs.writeFileSync(`${uploadDir}/${safeFileName}`, req.file.buffer);
        product.image = safeFileName;
      }
      const result = await productService.createProduct(product);

      res.status(200).json({
        success: true,
        message: "Tạo thành công",
        product: {
          product_id: result.insertId,
          ...product,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;

      await productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: "Xóa thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = {
        ...req.body,
      };

      if (req.file) {
        const uploadDir = "uploads";

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeFileName = Buffer.from(
          req.file.originalname,
          "latin1",
        ).toString("utf8");
        fs.writeFileSync(`${uploadDir}/${safeFileName}`, req.file.buffer);

        product.image = safeFileName;
      } else {
        product.image = req.body.oldImage;
      }

      await productService.updateProduct(id, product);

      const products = await productService.getProducts();

      const updatedBook = products.find((p) => p.product_id == id);

      res.status(200).json(updatedBook);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Lỗi cập nhật sách",
      });
    }
  },
};
export default productController;
