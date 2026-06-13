import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrders,
  getOrderDetail,
  getAllOrders,
  getOrderDetailAdmin,
  updateOrderStatus,
  cancelOrder,
  repayOrder,
  momoIPN,
  getOrderLogs,
} from "../controllers/order.controller.js";

const router = express.Router();

// Tạo đơn hàng
router.post("/", verifyToken, createOrder);

// Thanh toán lại
router.post("/repay", verifyToken, repayOrder);

// IPN MoMo
router.post("/momo-ipn", momoIPN);

// Danh sách đơn hàng của khách
router.get("/", verifyToken, getOrders);

// Admin lấy toàn bộ đơn hàng
router.get("/admin/all", verifyToken, getAllOrders);

// Admin xem chi tiết đơn
router.get("/admin/:id", verifyToken, getOrderDetailAdmin);

// Admin cập nhật trạng thái
router.put("/admin/:id/status", verifyToken, updateOrderStatus);

// Hủy đơn
router.put("/:id/cancel", verifyToken, cancelOrder);

// Chi tiết đơn hàng
router.get("/:id", verifyToken, getOrderDetail);

//Xem lịch sử cập nhật trạng thái
router.get("/admin/:id/logs", getOrderLogs);
export default router;
