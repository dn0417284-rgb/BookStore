import express from 'express';

import verifyToken
  from '../middlewares/auth.middleware.js';

import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
} from '../controllers/cart.controller.js';

const router =
  express.Router();

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

export default router;