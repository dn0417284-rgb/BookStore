import express from "express";
//import  from "../middlewares/auth.middleware.js";
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
} from "../controllers/order.controller.js";

const router = express.Router();

// Tạo đơn hàng
router.post("/", createOrder);

// Thanh toán lại
router.post("/repay", repayOrder);

// IPN MoMo
router.post("/momo-ipn", momoIPN);

// Danh sách đơn hàng của khách
router.get("/", getOrders);

// Admin lấy toàn bộ đơn hàng
router.get("/admin/all", getAllOrders);

// Admin xem chi tiết đơn
router.get("/admin/:id", getOrderDetailAdmin);

// Admin cập nhật trạng thái
router.put("/admin/:id/status", updateOrderStatus);

// Hủy đơn
router.put("/:id/cancel", cancelOrder);

// Chi tiết đơn hàng
router.get("/:id", getOrderDetail);

export default router;
