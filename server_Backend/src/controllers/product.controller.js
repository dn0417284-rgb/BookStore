import productService from "../services/product.service.js";
import productModel from "../models/product.model.js";

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
      const product = req.body;
      await productService.createProduct(product);

      res.status(200).json({
        success: true,
        message: "Tạo thành công",
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
      const product = req.body;
      await productService.updateProduct(id, product);
      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
};
export default productController;
