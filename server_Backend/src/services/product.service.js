import productModel from "../models/product.model.js";
//lay du lieu tu model
const productService = {
  getProducts: () => productModel.getProducts(),
  createProduct: (product) => productModel.createProduct(product),
  deleteProduct: (id) => productModel.deleteProduct(id),
  updateProduct: (id, product) => productModel.updateProduct(id, product),
};
export default productService;
