const express =
  require('express');

const router =
  express.Router();

const verifyToken =
  require('../middlewares/auth.middleware');

const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
} = require(
  '../controllers/cart.controller'
);

// Lấy giỏ hàng
router.get(
  '/',
  verifyToken,
  getCart
);

// Thêm sản phẩm
router.post(
  '/',
  verifyToken,
  addToCart
);

// Cập nhật số lượng
router.put(
  '/:productId',
  verifyToken,
  updateQuantity
);

// Xóa 1 sản phẩm
router.delete(
  '/:productId',
  verifyToken,
  removeItem
);

// Xóa toàn bộ giỏ
router.delete(
  '/',
  verifyToken,
  clearCart
);

module.exports =
  router;