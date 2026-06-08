import express from 'express';

import verifyToken from '../middlewares/auth.middleware.js';
import {
  createOrder,
  getOrders,
  getOrderDetail,
  getAllOrders,
  getOrderDetailAdmin,
  updateOrderStatus,
  cancelOrder,
  repayOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// Tạo đơn hàng
router.post(
  '/',
  verifyToken,
  createOrder
);

// Tạo lại link thanh toán
router.post(
  '/repay',
  verifyToken,
  repayOrder
);

// Lịch sử đơn hàng
router.get(
  '/',
  verifyToken,
  getOrders
);

// Admin: tất cả đơn hàng
router.get(
  '/admin/all',
  verifyToken,
  getAllOrders
);

// Admin: chi tiết đơn hàng
router.get(
  '/admin/:id',
  verifyToken,
  getOrderDetailAdmin
);

// Admin: cập nhật trạng thái
router.put(
  '/admin/:id/status',
  verifyToken,
  updateOrderStatus
);

// Khách hàng: hủy đơn
router.put(
  '/:id/cancel',
  verifyToken,
  cancelOrder
);

// Khách hàng: xem chi tiết đơn
router.get(
  '/:id',
  verifyToken,
  getOrderDetail
);

export default router;