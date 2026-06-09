const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  createOrder,
  getOrders,
  getOrderDetail,
  getAllOrders,
  getOrderDetailAdmin,
  updateOrderStatus,
  cancelOrder,
  repayOrder, // Bổ sung hàm repayOrder mới từ controller
  momoIPN, // Bổ sung hàm momoIPN mới từ controller
} = require("../controllers/order.controller");

// 1. Tuyến đường tạo mới đơn hàng
router.post("/", verifyToken, createOrder);

// 2. BỔ SUNG: Tuyến đường yêu cầu tạo lại liên kết thanh toán MoMo/ZaloPay cho đơn cũ
// Cần bảo mật bằng verifyToken giống y hệt như trang tạo đơn hàng chính
router.post("/repay", verifyToken, repayOrder);

// 3. BỔ SUNG: Tuyến đường nhận thông báo đối soát tiền tệ tự động gửi ngầm từ Server MoMo
// CHÚ Ý: Tuyệt đối KHÔNG thêm verifyToken ở đây vì đây là API công khai dành riêng cho Server MoMo gọi vào
router.post("/momo-ipn", momoIPN);

// 4. Tuyến đường lấy danh sách lịch sử đơn hàng của khách hiện tại
router.get("/", verifyToken, getOrders);

// 5. Tuyến đường Admin: Lấy toàn bộ đơn hàng trong hệ thống
router.get("/admin/all", verifyToken, getAllOrders);

// 6. Tuyến đường Admin: Xem chi tiết một mã đơn bất kỳ
router.get("/admin/:id", verifyToken, getOrderDetailAdmin);

// 7. Tuyến đường Admin: Cập nhật trạng thái giao hàng (SHIPPING, COMPLETED,...)
router.put("/admin/:id/status", verifyToken, updateOrderStatus);

// 8. Tuyến đường Khách hàng: Hủy đơn hàng tự động
router.put("/:id/cancel", verifyToken, cancelOrder);

// 9. Tuyến đường Khách hàng: Xem chi tiết một đơn hàng cụ thể của họ
router.get("/:id", verifyToken, getOrderDetail);

module.exports = router;
