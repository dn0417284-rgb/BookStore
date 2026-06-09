import express from "express";
import productController from "../controllers/product.controller.js";
import upload from "../config/upload.js";
const productRoutes = express.Router();

productRoutes.get("/", productController.getProducts);
productRoutes.post(
  "/",
  upload.single("image"),
  productController.createProduct,
);
productRoutes.delete("/:id", productController.deleteProduct);
productRoutes.put(
  "/:id",
  upload.single("image"),
  productController.updateProduct,
);

export default productRoutes;
