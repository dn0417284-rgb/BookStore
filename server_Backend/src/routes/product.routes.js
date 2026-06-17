import express from "express";
import productController from "../controllers/product.controller.js";
import upload from "../config/upload.js";

const productRoutes = express.Router();

// Public routes
productRoutes.get("/", productController.getProducts);

productRoutes.get(
  "/best-sellers",
  productController.getBestSellers
);

productRoutes.get(
  "/search",
  productController.searchProducts
);

productRoutes.get(
  "/filter",
  productController.filterProducts
);

productRoutes.get(
  "/:id",
  productController.getProductById
);

// Admin routes
productRoutes.post(
  "/",
  upload.single("image"),
  productController.createProduct
);

productRoutes.put(
  "/:id",
  upload.single("image"),
  productController.updateProduct
);

productRoutes.delete(
  "/:id",
  productController.deleteProduct
);

export default productRoutes;