import express from "express";

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

const orderRoutes = express.Router();

// 1. Tuyến đường tạo mới đơn hàng
orderRoutes.post("/", createOrder);

// 2. Bổ sung: tạo lại liên kết thanh toán MoMo/ZaloPay
orderRoutes.post("/repay", repayOrder);

// 3. Bổ sung: nhận thông báo đối soát từ Server MoMo
orderRoutes.post("/momo-ipn", momoIPN);

// 4. Lấy danh sách lịch sử đơn hàng của khách hiện tại
orderRoutes.get("/", getOrders);

// 5. Admin: lấy toàn bộ đơn hàng
orderRoutes.get("/admin/all", getAllOrders);

// 6. Admin: xem chi tiết một đơn hàng
orderRoutes.get("/admin/:id", getOrderDetailAdmin);

// 7. Admin: cập nhật trạng thái giao hàng
orderRoutes.put("/admin/:id/status", updateOrderStatus);

// 8. Khách hàng: hủy đơn hàng
orderRoutes.put("/:id/cancel", cancelOrder);

// 9. Khách hàng: xem chi tiết đơn hàng cụ thể
orderRoutes.get("/:id", getOrderDetail);

export default orderRoutes;
