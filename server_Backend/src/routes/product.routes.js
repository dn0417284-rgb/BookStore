import express from "express";
import productController from "../controllers/product.controller.js";
const productRoutes = express.Router();

productRoutes.get("/", productController.getProducts);
productRoutes.post("/", productController.createProduct);
productRoutes.delete("/:id", productController.deleteProduct);
productRoutes.put("/:id", productController.updateProduct);

export default productRoutes;
