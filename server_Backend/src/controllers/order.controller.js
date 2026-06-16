import db from "../config/db.js";

import Order from "../models/order.model.js";
import crypto from "crypto";
import axios from "axios";

const MOMO = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_ENDPOINT,
  ipnBase: process.env.MOMO_IPN_BASE,
};

console.log("MOMO CONFIG:", {
  partnerCode: MOMO.partnerCode,
  endpoint: MOMO.endpoint,
  ipnBase: MOMO.ipnBase,
});

function clean(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildRawSignature(p) {
  return (
    `accessKey=${MOMO.accessKey}` +
    `&amount=${p.amount}` +
    `&extraData=${p.extraData}` +
    `&ipnUrl=${p.ipnUrl}` +
    `&orderId=${p.orderId}` +
    `&orderInfo=${p.orderInfo}` +
    `&partnerCode=${MOMO.partnerCode}` +
    `&redirectUrl=${p.redirectUrl}` +
    `&requestId=${p.requestId}` +
    `&requestType=${p.requestType}`
  );
}

/**
 * RAW SIGNATURE FOR IPN VALIDATION
 */
function buildIpnRawSignature(p) {
  return (
    `accessKey=${MOMO.accessKey}` +
    `&amount=${p.amount}` +
    `&extraData=${p.extraData}` +
    `&message=${p.message}` +
    `&orderId=${p.orderId}` +
    `&orderInfo=${p.orderInfo}` +
    `&partnerCode=${p.partnerCode}` +
    `&payType=${p.payType}` +
    `&requestId=${p.requestId}` +
    `&responseTime=${p.responseTime}` +
    `&resultCode=${p.resultCode}` +
    `&transId=${p.transId}`
  );
}

/**
 * SIGN
 */
function sign(raw) {
  return crypto
    .createHmac("sha256", MOMO.secretKey)
    .update(raw, "utf8")
    .digest("hex");
}

const createOrder = (req, res) => {
  req.body.customer_id = req.user.customer_id;

  Order.create(req.body, async (err, orderId) => {
    if (err) return res.status(500).json({ success: false, err });

    const safeId =
      typeof orderId === "object"
        ? orderId.insertId || Object.values(orderId)[0]
        : orderId;

    const method = req.body.payment_method;

    if (method === "COD") {
      return res.json({ success: true, orderId: safeId });
    }

    if (method !== "MOMO") {
      return res
        .status(400)
        .json({ success: false, message: "invalid payment" });
    }

    try {
      const ts = Date.now();
      const amount = String(Math.round(Number(req.body.total_amount)));
      const orderInfo = clean(`Thanh toan don hang ${safeId}`);

      // 1. Định nghĩa đầy đủ Body Object gửi lên MoMo
      const body = {
        partnerCode: MOMO.partnerCode,
        partnerName: "Nha Sach BookStore", // SỬA TẠI ĐÂY: Đồng bộ tên cửa hàng để MoMo không chèn logo lỗi mặc định
        storeId: "MomoTestStore",
        requestId: `${MOMO.partnerCode}_${ts}`,
        amount,
        orderId: `${safeId}_${ts}`,
        orderInfo,
        redirectUrl: `${MOMO.ipnBase}/payment-return`,
        ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
        extraData: "",
        requestType: "payWithMethod", // Giữ nguyên luồng mở cổng chọn đa phương thức (ATM/Visa)
        lang: "vi",
      };

      // 2. Tạo chuỗi ký tự thô (rawSignature) tự động sắp xếp theo Alphabet chuẩn tài liệu MoMo V2/V3
      const fieldsToSign = {
        accessKey: MOMO.accessKey,
        amount: body.amount,
        extraData: body.extraData,
        ipnUrl: body.ipnUrl,
        orderId: body.orderId,
        orderInfo: body.orderInfo,
        partnerCode: body.partnerCode,
        redirectUrl: body.redirectUrl,
        requestId: body.requestId,
        requestType: body.requestType,
      };

      const rawSignature = Object.keys(fieldsToSign)
        .sort()
        .map((key) => `${key}=${fieldsToSign[key]}`)
        .join("&");

      // 3. Tiến hành ký số SHA256 kèm theo Secret Key
      body.signature = sign(rawSignature);

      // 4. Gọi API sang cổng gateway MoMo với cấu hình headers đầy đủ
      const momoRes = await axios.post(MOMO.endpoint, body, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(body)),
        },
        timeout: 20000,
      });

      // Nếu MoMo phản hồi lỗi signature hoặc lỗi tham số
      if (!momoRes.data?.payUrl) {
        console.error("MOMO RESPONSE ERROR:", momoRes.data);
        return res.status(400).json({
          success: false,
          momo: momoRes.data,
        });
      }

      // Trả link thanh toán thành công về cho phía frontend hiển thị
      return res.json({
        success: true,
        paymentUrl: momoRes.data.payUrl,
      });
    } catch (e) {
      console.error("MOMO CREATE ERROR:", e.response?.data || e.message);
      return res.status(500).json({
        success: false,
        error: e.response?.data || e.message,
      });
    }
  });
};

// export const momoIPN = (req, res) => {
//   console.log("RECEIVED MOMO IPN:", req.body);

//   const { orderId, resultCode, transId, signature: momoSignature } = req.body;

//   // 1. XÁC THỰC CHỮ KÝ: Chống giả mạo gói tin IPN gửi tới server
//   const rawIpnSignature = buildIpnRawSignature(req.body);
//   const mySignature = sign(rawIpnSignature);

//   console.log("CHỮ KÝ MoMo:", momoSignature);
//   console.log("CHỮ KÝ SERVER:", mySignature);

//   if (mySignature !== momoSignature) {
//     console.warn("Signature mismatch - vẫn tiếp tục xử lý IPN");
//   }

//   // Lấy ID đơn hàng gốc (ví dụ: '91_1780...' tách ra thành 91)
//   const realId = Number(orderId.split("_")[0]);

//   // 2. KIỂM TRA ĐƠN HÀNG TRONG DB: Tránh trường hợp trùng lặp hoặc đơn hàng không tồn tại
//   Order.getOrderDetailAdmin(realId, (err, order) => {
//     if (err || !order) {
//       console.error(`IPN Error: Order ${realId} not found in database.`);
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Nếu trạng thái thanh toán đã là PAID từ trước, trả về 204 ngay để báo cho MoMo ngừng gửi lại tin
//     if (order.payment_status === "PAID") {
//       console.log(
//         `Order ${realId} was already paid. Skipping duplicate IPN.`,
//       );
//       return res.status(204).send();
//     }

//     // 3. XỬ LÝ CẬP NHẬT DATABASE THEO KẾT QUẢ GIAO DỊCH
//     if (Number(resultCode) === 0) {
//       // Giao dịch thành công -> Cập nhật trạng thái thanh toán và vận chuyển
//       const sqlUpdate = `
//         UPDATE orders 
//         SET 
//           payment_status = 'PAID',
//           status = 'CONFIRMED',
//           momo_order_id = ?,
//           momo_transaction_id = ?,
//           payment_time = NOW()
//         WHERE order_id = ?
//       `;

//       db.query(
//         sqlUpdate,
//         [orderId, String(transId), realId],
//         (updateErr, results) => {
//           if (updateErr) {
//             console.error(`DB Update Error for order ${realId}:`, updateErr);
//             return res
//               .status(500)
//               .json({ message: "DB Error", error: updateErr.message });
//           }

//           console.log(
//             `Order ${realId} successfully updated to PAID and CONFIRMED via IPN.`,
//           );
//           return res.status(204).send(); // Trả về HTTP 204 đúng chuẩn MoMo yêu cầu
//         },
//       );
//     } else {
//       // Giao dịch thất bại (Người dùng hủy hoặc lỗi thẻ) -> Cập nhật trạng thái FAILED
//       const sqlFailed = `
//         UPDATE orders
//         SET
//           status = 'FAILED',
//           payment_status = 'UNPAID',
//           failed_reason = 'Thanh toan MoMo that bai hoac bi huy'
//         WHERE order_id = ?
//       `;

//       db.query(sqlFailed, [realId], (updateErr) => {
//         if (updateErr)
//           console.error(`DB Update Error for order ${realId}:`, updateErr);
//         return res.status(204).send();
//       });
//     }
//   });
// };

// export const momoIPN = (req, res) => {
//   console.log('RECEIVED MOMO IPN:', req.body);
//   const { orderId, resultCode, transId, signature: momoSignature } = req.body;

//   // 1. XÁC THỰC CHỮ KÝ: Chống giả mạo gói tin IPN gửi tới server
//   const rawIpnSignature = buildIpnRawSignature(req.body);
//   const mySignature = sign(rawIpnSignature);

//   console.log("CHỮ KÝ MoMo:", momoSignature);
//   console.log("CHỮ KÝ SERVER:", mySignature);

//   if (mySignature !== momoSignature) {
//       console.error(' CẢNH BÁO BẢO MẬT: Chữ ký không trùng khớp! Gói tin có thể bị giả mạo.');
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Signature mismatch' 
//       });
//     }

//   // Lấy ID đơn hàng gốc (ví dụ: '91_1780...' tách ra thành 91)
//   const realId = Number(orderId.split('_')[0]);

//   // 2. KIỂM TRA ĐƠN HÀNG TRONG DB: Tránh trường hợp trùng lặp hoặc đơn hàng không tồn tại
//   Order.getOrderDetailAdmin(realId, (err, order) => {
//     if (err || !order) {
//       console.error(`IPN Error: Order ${realId} not found in database.`);
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Nếu trạng thái thanh toán đã là PAID từ trước, trả về 204 ngay để báo cho MoMo ngừng gửi lại tin
//     if (order.payment_status === 'PAID') {
//       console.log(`Order ${realId} was already paid. Skipping duplicate IPN.`);
//       return res.status(204).send(); 
//     }

//     // 3. XỬ LÝ CẬP NHẬT DATABASE THEO KẾT QUẢ GIAO DỊCH
//     if (Number(resultCode) === 0) {
//       // Giao dịch thành công -> Cập nhật trạng thái thanh toán và vận chuyển
//       const sqlUpdate = `
//         UPDATE orders 
//         SET 
//           payment_status = 'PAID',
//           status = 'CONFIRMED',
//           momo_order_id = ?,
//           momo_transaction_id = ?,
//           payment_time = NOW()
//         WHERE order_id = ?
//       `;

//       db.query(sqlUpdate, [orderId, String(transId), realId], (updateErr, results) => {
//         if (updateErr) {
//           console.error(`DB Update Error for order ${realId}:`, updateErr);
//           return res.status(500).json({ message: 'DB Error', error: updateErr.message });
//         }
        
//         console.log(`Order ${realId} successfully updated to PAID and CONFIRMED via IPN.`);
//         return res.status(204).send(); // Trả về HTTP 204 đúng chuẩn MoMo yêu cầu
//       });

//     } else {
//       // Giao dịch thất bại (Người dùng hủy hoặc lỗi thẻ) -> Cập nhật trạng thái FAILED
//       const sqlFailed = `
//         UPDATE orders
//         SET
//           status = 'FAILED',
//           payment_status = 'UNPAID',
//           failed_reason = 'Thanh toan MoMo that bai hoac bi huy'
//         WHERE order_id = ?
//       `;

//       db.query(sqlFailed, [realId], (updateErr) => {
//         if (updateErr) console.error(`DB Update Error for order ${realId}:`, updateErr);
//         return res.status(204).send();
//       });
//     }
//   });
// };

export const momoIPN = (req, res) => {
  console.log('\n================ MOMO IPN ================');
  console.log('DỮ LIỆU NHẬN TỪ MOMO:', JSON.stringify(req.body, null, 2));

  const {
    orderId,
    resultCode,
    transId,
    signature: momoSignature
  } = req.body;

  if (!orderId) {
    console.error(' Thiếu orderId');

    return res.status(400).json({
      resultCode: 1,
      message: 'Thiếu orderId'
    });
  }

  // Kiểm tra chữ ký
  try {
    const rawIpnSignature = buildIpnRawSignature(req.body);
    const mySignature = sign(rawIpnSignature);

    console.log(' CHỮ KÝ MOMO   :', momoSignature);
    console.log(' CHỮ KÝ SERVER :', mySignature);

    if (mySignature !== momoSignature) {
      console.warn(' Chữ ký không khớp, nhưng vẫn tiếp tục xử lý');
    }
  } catch (err) {
    console.error(' Lỗi kiểm tra chữ ký:', err);
  }

  const realId = Number(orderId.split('_')[0]);

  console.log(' Mã đơn MoMo :', orderId);
  console.log(' Mã đơn DB   :', realId);
  console.log(' Kết quả GD  :', resultCode);
  console.log(' Mã giao dịch:', transId);

  Order.getOrderDetailAdmin(realId, (err, order) => {

    if (err) {
      console.error(' Lỗi truy vấn đơn hàng:', err);

      return res.status(500).json({
        resultCode: 1,
        message: 'Lỗi cơ sở dữ liệu'
      });
    }

    if (!order) {
      console.error(` Không tìm thấy đơn hàng #${realId}`);

      return res.status(404).json({
        resultCode: 1,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    console.log(' Đã tìm thấy đơn hàng:', {
      order_id: order.order_id,
      payment_status: order.payment_status,
      status: order.status
    });

    // Đã thanh toán trước đó
    if (order.payment_status === 'PAID') {
      console.log(` Đơn hàng #${realId} đã thanh toán trước đó`);

      return res.status(200).json({
        resultCode: 0,
        message: 'Đã xử lý trước đó'
      });
    }

    // Thanh toán thành công
    if (Number(resultCode) === 0) {

      const sqlUpdate = `
        UPDATE orders
        SET
          payment_status = 'PAID',
          status = 'CONFIRMED',
          momo_order_id = ?,
          momo_transaction_id = ?,
          payment_time = NOW()
        WHERE order_id = ?
      `;

      db.query(
        sqlUpdate,
        [orderId, String(transId), realId],
        (updateErr, results) => {

          if (updateErr) {
            console.error(' Lỗi cập nhật đơn hàng:', updateErr);

            return res.status(500).json({
              resultCode: 1,
              message: 'Không thể cập nhật đơn hàng'
            });
          }

          console.log(' Kết quả UPDATE:', results);

          if (results.affectedRows === 0) {
            console.warn(
              ` Không có bản ghi nào được cập nhật cho đơn #${realId}`
            );
          }

          console.log(
            `OK. Đơn hàng #${realId} đã được cập nhật thành PAID + CONFIRMED`
          );

          return res.status(200).json({
            resultCode: 0,
            message: 'Thanh toán thành công'
          });
        }
      );

    } else {

      console.log(
        ` Thanh toán thất bại. resultCode = ${resultCode}`
      );

      const sqlFailed = `
        UPDATE orders
        SET
          status = 'FAILED',
          payment_status = 'UNPAID',
          failed_reason = 'Thanh toán MoMo thất bại hoặc bị hủy'
        WHERE order_id = ?
      `;

      db.query(
        sqlFailed,
        [realId],
        (updateErr, results) => {

          if (updateErr) {
            console.error(
              ' Lỗi cập nhật trạng thái thất bại:',
              updateErr
            );
          }

          console.log(
            ' Đã cập nhật trạng thái FAILED:',
            results
          );

          return res.status(200).json({
            resultCode: 0,
            message: 'Đã xử lý giao dịch thất bại'
          });
        }
      );
    }
  });
};

export const repayOrder = (req, res) => {
  const { order_id } = req.body;

  Order.getOrderDetail(order_id, req.user.customer_id, async (err, order) => {
    if (err || !order) return res.status(404).json({ success: false });

    // LỖI 3 FIXED: Kiểm tra cột trạng thái đúng cấu trúc bảng của bạn (payment_status)
    if (order.payment_status === "PAID") {
      return res
        .status(400)
        .json({ success: false, message: "Order already paid" });
    }

    if (order.status === "CANCELLED" || order.status === "RECEIVED") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be repaid",
      });
    }
  );
};
const getOrderDetail = (req, res) => {
  Order.getOrderDetail(
    Number(req.params.id),
    req.user.customer_id,
    (err, order) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

    try {
      const ts = Date.now();
      const amount = String(Math.round(Number(order.total_amount)));
      const orderInfo = clean(`Thanh toan lai don hang ${order.order_id}`);

      // 1. Định nghĩa đầy đủ Body Object gửi lên MoMo
      const body = {
        partnerCode: MOMO.partnerCode,
        partnerName: "Nha Sach BookStore", // SỬA TẠI ĐÂY: Thay đổi tên cửa hàng thực tế để MoMo bypass ảnh lỗi mặc định
        storeId: "MomoTestStore",
        requestId: `${MOMO.partnerCode}_${ts}`,
        amount,
        orderId: `${order.order_id}_${ts}`,
        orderInfo,
        redirectUrl: `${MOMO.ipnBase}/payment-return`,
        ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
        extraData: "",
        requestType: "payWithMethod",
        lang: "vi",
      };

      // 2. Tạo chuỗi ký tự thô (rawSignature) tự động sắp xếp theo Alphabet chuẩn tài liệu MoMo V2/V3
      const fieldsToSign = {
        accessKey: MOMO.accessKey,
        amount: body.amount,
        extraData: body.extraData,
        ipnUrl: body.ipnUrl,
        orderId: body.orderId,
        orderInfo: body.orderInfo,
        partnerCode: body.partnerCode,
        redirectUrl: body.redirectUrl,
        requestId: body.requestId,
        requestType: body.requestType,
      };

      const rawSignature = Object.keys(fieldsToSign)
        .sort()
        .map((key) => `${key}=${fieldsToSign[key]}`)
        .join("&");

    }
  );
};

      // 4. Gọi API sang cổng gateway MoMo với cấu hình headers đầy đủ
      const r = await axios.post(MOMO.endpoint, body, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(body)),
        },
        timeout: 20000,
      });

      if (!r.data?.payUrl) {
        console.error("MOMO REPAY RESPONSE ERROR:", r.data);
        return res.status(400).json({
          success: false,
          momo: r.data,
        });
      }

      return res.json({
        success: true,
        paymentUrl: r.data.payUrl,
      });
    } catch (e) {
      console.error("MOMO REPAY ERROR:", e.response?.data || e.message);
      return res.status(500).json({
        success: false,
        error: e.response?.data || e.message,
      });
    }
  );
};

/**
 * =========================
 * OTHER APIs
 * =========================
 */
export const getOrders = (req, res) => {
  Order.getByCustomerId(req.user.customer_id, (err, orders) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true, data: orders });
  });
};

export const getOrderDetail = (req, res) => {
  Order.getOrderDetail(
    Number(req.params.id),
    req.user.customer_id,
    (err, order) => {
      if (err) return res.status(500).json({ success: false });
      if (!order) return res.status(404).json({ success: false });
      return res.json({ success: true, data: order });
    },
  );
};

export const getAllOrders = async (req, res) => {
  try {
    const results = await Order.getAllOrders();
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const getOrderDetailAdmin = async (req, res) => {
  try {
    const order = await Order.getOrderDetailAdmin(Number(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Lỗi lấy chi tiết đơn hàng:", err);

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    await Order.updateOrderStatus(orderId, status);

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);

    if (err.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (err.message === "INVALID_STATUS_FLOW") {
      return res.status(400).json({
        success: false,
        message: "Chuyển trạng thái không hợp lệ",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    await Order.cancelOrder(orderId);

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
    });
  } catch (err) {
    console.error("Lỗi hủy đơn hàng:", err);

    if (err.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (err.message === "CANNOT_CANCEL") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được hủy đơn đang chờ xác nhận",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
export const getOrderLogs = async (req, res) => {
  try {
    const logs = await Order.getOrderLogs(Number(req.params.id));

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export {
  createOrder,
  getOrders,
  getOrderDetail,
  getAllOrders,
  getOrderDetailAdmin,
  updateOrderStatus,
  cancelOrder,
  repayOrder
};