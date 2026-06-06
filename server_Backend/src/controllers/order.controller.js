const db = require('../config/db'); // Đảm bảo import biến kết nối database vào controller

const Order = require('../models/order.model');
const crypto = require('crypto');
const axios = require('axios');

// Cấu hình bằng biến môi trường (env) để bảo mật, không hardcode key thật
const MOMO = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  ipnBase: process.env.MOMO_IPN_BASE || 'https://around-germicide-occupy.ngrok-free.dev'
};

/**
 * CLEAN TEXT
 */
function clean(v) {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * RAW SIGNATURE FOR REQUEST
 */
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
    .createHmac('sha256', MOMO.secretKey)
    .update(raw, 'utf8')
    .digest('hex');
}

/**
 * =========================
 * CREATE ORDER
 * =========================
 */
// exports.createOrder = (req, res) => {
//   req.body.customer_id = req.user.customer_id;

//   Order.create(req.body, async (err, orderId) => {
//     if (err) return res.status(500).json({ success: false, err });

//     const safeId =
//       typeof orderId === 'object'
//         ? orderId.insertId || Object.values(orderId)[0]
//         : orderId;

//     const method = req.body.payment_method;

//     if (method === 'COD') {
//       return res.json({ success: true, orderId: safeId });
//     }

//     if (method !== 'MOMO') {
//       return res.status(400).json({ success: false, message: 'invalid payment' });
//     }

//     try {
//       const ts = Date.now();
//       const amount = String(Math.round(Number(req.body.total_amount)));
//       const orderInfo = clean(`Thanh toan don hang ${safeId}`);

//       const payload = {
//         amount,
//         extraData: '',
//         ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
//         orderId: `${safeId}_${ts}`,
//         orderInfo,
//         partnerCode: MOMO.partnerCode,
//         redirectUrl: `${MOMO.ipnBase}/payment-return`,
//         requestId: `${MOMO.partnerCode}_${ts}`,
//         requestType: 'captureWallet'
//       };

//       const rawSignature = buildRawSignature(payload);
//       const signature = sign(rawSignature);

//       const body = {
//         partnerCode: MOMO.partnerCode,
//         accessKey: MOMO.accessKey,
//         requestId: payload.requestId,
//         amount: payload.amount,
//         orderId: payload.orderId,
//         orderInfo: payload.orderInfo,
//         redirectUrl: payload.redirectUrl,
//         ipnUrl: payload.ipnUrl,
//         extraData: payload.extraData,
//         requestType: payload.requestType,
//         signature,
//         lang: 'vi'
//       };

//       const momoRes = await axios.post(MOMO.endpoint, body, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 20000
//       });

//       if (!momoRes.data?.payUrl) {
//         return res.status(400).json({
//           success: false,
//           momo: momoRes.data
//         });
//       }

//       return res.json({
//         success: true,
//         paymentUrl: momoRes.data.payUrl
//       });

//     } catch (e) {
//       console.error('MOMO CREATE ERROR:', e.response?.data || e.message);
//       return res.status(500).json({
//         success: false,
//         error: e.response?.data || e.message
//       });
//     }
//   });
// };

// exports.createOrder = (req, res) => {
//   req.body.customer_id = req.user.customer_id;

//   Order.create(req.body, async (err, orderId) => {
//     if (err) return res.status(500).json({ success: false, err });

//     const safeId =
//       typeof orderId === 'object'
//         ? orderId.insertId || Object.values(orderId)[0]
//         : orderId;

//     const method = req.body.payment_method;

//     if (method === 'COD') {
//       return res.json({ success: true, orderId: safeId });
//     }

//     if (method !== 'MOMO') {
//       return res.status(400).json({ success: false, message: 'invalid payment' });
//     }

//     try {
//       const ts = Date.now();
//       const amount = String(Math.round(Number(req.body.total_amount)));
//       const orderInfo = clean(`Thanh toan don hang ${safeId}`);

//       // 1. Định nghĩa đầy đủ Body Object gửi lên MoMo (Bao gồm các trường test nâng cao)
//       const body = {
//         partnerCode: MOMO.partnerCode,
//         partnerName: "Test Store",
//         storeId: "MomoTestStore",
//         requestId: `${MOMO.partnerCode}_${ts}`,
//         amount,
//         orderId: `${safeId}_${ts}`,
//         orderInfo,
//         redirectUrl: `${MOMO.ipnBase}/payment-return`,
//         ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
//         extraData: '',
//         requestType: 'payWithMethod', // Mở cổng chọn đa phương thức
//         paymentCode: 'CC',          // CHÚ Ý: Để 'ATM' để dùng thẻ 9704. Đổi thành 'CC' nếu muốn dùng thẻ Visa 5200
//         lang: 'vi'
//       };

//       // 2. Tạo chuỗi ký tự thô (rawSignature) tự động sắp xếp theo Alphabet chuẩn tài liệu MoMo V2/V3
//       // Loại bỏ các trường không tham gia vào chuỗi ký số (như partnerName, storeId, paymentCode, lang, signature)
//       const fieldsToSign = {
//         accessKey: MOMO.accessKey,
//         amount: body.amount,
//         extraData: body.extraData,
//         ipnUrl: body.ipnUrl,
//         orderId: body.orderId,
//         orderInfo: body.orderInfo,
//         partnerCode: body.partnerCode,
//         redirectUrl: body.redirectUrl,
//         requestId: body.requestId,
//         requestType: body.requestType
//       };

//       const rawSignature = Object.keys(fieldsToSign)
//         .sort()
//         .map(key => `${key}=${fieldsToSign[key]}`)
//         .join('&');

//       // 3. Tiến hành ký số SHA256 kèm theo Secret Key
//       body.signature = sign(rawSignature);

//       // 4. Gọi API sang cổng gateway MoMo với cấu hình đầy đủ
//       const momoRes = await axios.post(MOMO.endpoint, body, {
//         headers: { 
//           'Content-Type': 'application/json',
//           'Content-Length': Buffer.byteLength(JSON.stringify(body))
//         },
//         timeout: 20000
//       });

//       // Nếu MoMo phản hồi lỗi signature hoặc lỗi tham số
//       if (!momoRes.data?.payUrl) {
//         console.error('MOMO RESPONSE ERROR:', momoRes.data);
//         return res.status(400).json({
//           success: false,
//           momo: momoRes.data
//         });
//       }

//       // Trả link thanh toán thành công về cho phía frontend
//       return res.json({
//         success: true,
//         paymentUrl: momoRes.data.payUrl
//       });

//     } catch (e) {
//       console.error('MOMO CREATE ERROR:', e.response?.data || e.message);
//       return res.status(500).json({
//         success: false,
//         error: e.response?.data || e.message
//       });
//     }
//   });
// };

exports.createOrder = (req, res) => {
  req.body.customer_id = req.user.customer_id;

  Order.create(req.body, async (err, orderId) => {
    if (err) return res.status(500).json({ success: false, err });

    const safeId =
      typeof orderId === 'object'
        ? orderId.insertId || Object.values(orderId)[0]
        : orderId;

    const method = req.body.payment_method;

    if (method === 'COD') {
      return res.json({ success: true, orderId: safeId });
    }

    if (method !== 'MOMO') {
      return res.status(400).json({ success: false, message: 'invalid payment' });
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
        extraData: '',
        requestType: 'payWithMethod', // Giữ nguyên luồng mở cổng chọn đa phương thức (ATM/Visa)
        lang: 'vi'
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
        requestType: body.requestType
      };

      const rawSignature = Object.keys(fieldsToSign)
        .sort()
        .map(key => `${key}=${fieldsToSign[key]}`)
        .join('&');

      // 3. Tiến hành ký số SHA256 kèm theo Secret Key
      body.signature = sign(rawSignature);

      // 4. Gọi API sang cổng gateway MoMo với cấu hình headers đầy đủ
      const momoRes = await axios.post(MOMO.endpoint, body, {
        headers: { 
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(body))
        },
        timeout: 20000
      });

      // Nếu MoMo phản hồi lỗi signature hoặc lỗi tham số
      if (!momoRes.data?.payUrl) {
        console.error('MOMO RESPONSE ERROR:', momoRes.data);
        return res.status(400).json({
          success: false,
          momo: momoRes.data
        });
      }

      // Trả link thanh toán thành công về cho phía frontend hiển thị
      return res.json({
        success: true,
        paymentUrl: momoRes.data.payUrl
      });

    } catch (e) {
      console.error('MOMO CREATE ERROR:', e.response?.data || e.message);
      return res.status(500).json({
        success: false,
        error: e.response?.data || e.message
      });
    }
  });
};


/**
 * =========================
 * IPN CALLBACK (ĐÃ SỬA LỖI BẢO MẬT PHẢI CÓ)
 * =========================
 */
// exports.momoIPN = (req, res) => {
//   console.log('RECEIVED MOMO IPN:', req.body);
//   const { orderId, resultCode, transId } = req.body;

//   // Lấy ID đơn hàng gốc (ví dụ: '91_1780...' tách ra thành 91)
//   const realId = Number(orderId.split('_')[0]);

//   // CHẠY THẲNG VÀO LOGIC CẬP NHẬT DATABASE KHI GIAO DỊCH THÀNH CÔNG (resultCode === 0)
//   if (Number(resultCode) === 0) {
    
//     // Câu lệnh SQL cập nhật chính xác: Cột payment_status ăn giá trị 'PAID', cột status ăn giá trị 'CONFIRMED'
//     const sqlUpdate = `
//       UPDATE orders 
//       SET 
//         payment_status = 'PAID',
//         status = 'CONFIRMED',
//         momo_order_id = ?,
//         momo_transaction_id = ?,
//         payment_time = NOW()
//       WHERE order_id = ?
//     `;

//     db.query(sqlUpdate, [orderId, String(transId), realId], (updateErr, results) => {
//       if (updateErr) {
//         console.error(`DB Update Error for order ${realId}:`, updateErr);
//         return res.status(500).json({ message: 'DB Error', error: updateErr.message });
//       }
      
//       console.log(`✅ Order ${realId} successfully updated to PAID and CONFIRMED via IPN.`);
//       return res.status(204).send(); // Trả về HTTP 204 No Content đúng chuẩn MoMo yêu cầu
//     });

//   } else {
//     // Nếu giao dịch thất bại (Người dùng hủy hoặc lỗi thẻ)
//     const sqlFailed = `
//       UPDATE orders 
//       SET 
//         status = 'FAILED',
//         failed_reason = 'Thanh toan MoMo that bai hoac bi huy'
//       WHERE order_id = ?
//     `;

//     db.query(sqlFailed, [realId], (updateErr) => {
//       if (updateErr) console.error(`DB Update Error for order ${realId}:`, updateErr);
//       return res.status(204).send();
//     });
//   }
// };

exports.momoIPN = (req, res) => {
  console.log('RECEIVED MOMO IPN:', req.body);
  const { orderId, resultCode, transId, signature: momoSignature } = req.body;

  // 1. XÁC THỰC CHỮ KÝ: Chống giả mạo gói tin IPN gửi tới server
  const rawIpnSignature = buildIpnRawSignature(req.body);
  const mySignature = sign(rawIpnSignature);

console.log("👉 CHỮ KÝ HỢP LỆ SERVER TỰ TÍNH ĐƯỢC LÀ:", mySignature);

  if (mySignature !== momoSignature) {
    console.error('⚠️ ALERT: IPN Signature Mismatch! Giao dịch có dấu hiệu giả mạo.');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  // Lấy ID đơn hàng gốc (ví dụ: '91_1780...' tách ra thành 91)
  const realId = Number(orderId.split('_')[0]);

  // 2. KIỂM TRA ĐƠN HÀNG TRONG DB: Tránh trường hợp trùng lặp hoặc đơn hàng không tồn tại
  Order.getOrderDetailAdmin(realId, (err, order) => {
    if (err || !order) {
      console.error(`⚠️ IPN Error: Order ${realId} not found in database.`);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Nếu trạng thái thanh toán đã là PAID từ trước, trả về 204 ngay để báo cho MoMo ngừng gửi lại tin
    if (order.payment_status === 'PAID') {
      console.log(`ℹ️ Order ${realId} was already paid. Skipping duplicate IPN.`);
      return res.status(204).send(); 
    }

    // 3. XỬ LÝ CẬP NHẬT DATABASE THEO KẾT QUẢ GIAO DỊCH
    if (Number(resultCode) === 0) {
      // Giao dịch thành công -> Cập nhật trạng thái thanh toán và vận chuyển
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

      db.query(sqlUpdate, [orderId, String(transId), realId], (updateErr, results) => {
        if (updateErr) {
          console.error(`DB Update Error for order ${realId}:`, updateErr);
          return res.status(500).json({ message: 'DB Error', error: updateErr.message });
        }
        
        console.log(`✅ Order ${realId} successfully updated to PAID and CONFIRMED via IPN.`);
        return res.status(204).send(); // Trả về HTTP 204 đúng chuẩn MoMo yêu cầu
      });

    } else {
      // Giao dịch thất bại (Người dùng hủy hoặc lỗi thẻ) -> Cập nhật trạng thái FAILED
      const sqlFailed = `
        UPDATE orders 
        SET 
          status = 'FAILED',
          failed_reason = 'Thanh toan MoMo that bai hoac bi huy'
        WHERE order_id = ?
      `;

      db.query(sqlFailed, [realId], (updateErr) => {
        if (updateErr) console.error(`DB Update Error for order ${realId}:`, updateErr);
        return res.status(204).send();
      });
    }
  });
};





/**
 * =========================
 * REPAY (ĐÃ SỬA LỖI KIỂM TRA TRẠNG THÁI)
 * =========================
 */
// exports.repayOrder = (req, res) => {
//   const { order_id } = req.body;

//   Order.getOrderDetail(order_id, req.user.customer_id, async (err, order) => {
//     if (err || !order) return res.status(404).json({ success: false });

//     // LỖI 3 FIXED: Không cho phép tạo link thanh toán mới nếu đơn hàng cũ đã được trả tiền
//     if (order.status === 'PAID') {
//       return res.status(400).json({ success: false, message: 'Order already paid' });
//     }

//     try {
//       const ts = Date.now();
//       const amount = String(Math.round(Number(order.total_amount)));
//       const orderInfo = clean(`Repay order ${order.order_id}`);

//       const payload = {
//         amount,
//         extraData: '',
//         ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
//         orderId: `${order.order_id}_${ts}`,
//         orderInfo,
//         partnerCode: MOMO.partnerCode,
//         redirectUrl: `${MOMO.ipnBase}/payment-return`,
//         requestId: `${MOMO.partnerCode}_${ts}`,
//         requestType: 'captureWallet'
//       };

//       const rawSignature = buildRawSignature(payload);
//       const signature = sign(rawSignature);

//       const body = {
//         partnerCode: MOMO.partnerCode,
//         accessKey: MOMO.accessKey,
//         requestId: payload.requestId,
//         amount: payload.amount,
//         orderId: payload.orderId,
//         orderInfo: payload.orderInfo,
//         redirectUrl: payload.redirectUrl,
//         ipnUrl: payload.ipnUrl,
//         extraData: payload.extraData,
//         requestType: payload.requestType,
//         signature,
//         lang: 'vi'
//       };

//       const r = await axios.post(MOMO.endpoint, body);

//       return res.json({
//         success: true,
//         paymentUrl: r.data.payUrl
//       });

//     } catch (e) {
//       return res.status(500).json({
//         success: false,
//         error: e.response?.data || e.message
//       });
//     }
//   });
// };

// exports.repayOrder = (req, res) => {
//   const { order_id } = req.body;

//   Order.getOrderDetail(order_id, req.user.customer_id, async (err, order) => {
//     if (err || !order) return res.status(404).json({ success: false });

//     // LỖI 3 FIXED: Không cho phép tạo link thanh toán mới nếu đơn hàng cũ đã được trả tiền
//     if (order.status === 'PAID') {
//       return res.status(400).json({ success: false, message: 'Order already paid' });
//     }

//     try {
//       const ts = Date.now();
//       const amount = String(Math.round(Number(order.total_amount)));
//       const orderInfo = clean(`Repay order ${order.order_id}`);

//       const payload = {
//         amount,
//         extraData: '',
//         ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,
//         orderId: `${order.order_id}_${ts}`,
//         orderInfo,
//         partnerCode: MOMO.partnerCode,
//         redirectUrl: `${MOMO.ipnBase}/payment-return`,
//         requestId: `${MOMO.partnerCode}_${ts}`,
//         requestType: 'payWithMethod' // ĐỔI THÀNH: 'payWithMethod' để hỗ trợ đa nguồn tiền (Thẻ quốc tế/ATM)
//       };

//       const rawSignature = buildRawSignature(payload);
//       const signature = sign(rawSignature);

//       const body = {
//         partnerCode: MOMO.partnerCode,
//         partnerName: "Test Store", // Đồng bộ bổ sung tên cửa hàng
//         storeId: "MomoTestStore",  // Đồng bộ bổ sung mã cửa hàng
//         requestId: payload.requestId,
//         amount: payload.amount,
//         orderId: payload.orderId,
//         orderInfo: payload.orderInfo,
//         redirectUrl: payload.redirectUrl,
//         ipnUrl: payload.ipnUrl,
//         extraData: payload.extraData,
//         requestType: payload.requestType,
//         signature,
//         lang: 'vi'
//       };

//       // Đã thêm cấu hình headers và timeout cho đồng bộ với hàm createOrder
//       const r = await axios.post(MOMO.endpoint, body, {
//         headers: { 
//           'Content-Type': 'application/json',
//           'Content-Length': Buffer.byteLength(JSON.stringify(body))
//         },
//         timeout: 20000
//       });

//       if (!r.data?.payUrl) {
//         console.error('MOMO REPAY RESPONSE ERROR:', r.data);
//         return res.status(400).json({
//           success: false,
//           momo: r.data
//         });
//       }

//       return res.json({
//         success: true,
//         paymentUrl: r.data.payUrl
//       });

//     } catch (e) {
//       console.error('MOMO REPAY ERROR:', e.response?.data || e.message);
//       return res.status(500).json({
//         success: false,
//         error: e.response?.data || e.message
//       });
//     }
//   });
// };

exports.repayOrder = (req, res) => {
  const { order_id } = req.body;

  Order.getOrderDetail(order_id, req.user.customer_id, async (err, order) => {
    if (err || !order) return res.status(404).json({ success: false });

    // LỖI 3 FIXED: Kiểm tra cột trạng thái đúng cấu trúc bảng của bạn (payment_status)
    if (order.payment_status === 'PAID') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
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
        extraData: '',
        requestType: 'payWithMethod',
        lang: 'vi'
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
        requestType: body.requestType
      };

      const rawSignature = Object.keys(fieldsToSign)
        .sort()
        .map(key => `${key}=${fieldsToSign[key]}`)
        .join('&');

      // 3. Tiến hành ký số SHA256 kèm theo Secret Key
      body.signature = sign(rawSignature);

      // 4. Gọi API sang cổng gateway MoMo với cấu hình headers đầy đủ
      const r = await axios.post(MOMO.endpoint, body, {
        headers: { 
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(body))
        },
        timeout: 20000
      });

      if (!r.data?.payUrl) {
        console.error('MOMO REPAY RESPONSE ERROR:', r.data);
        return res.status(400).json({
          success: false,
          momo: r.data
        });
      }

      return res.json({
        success: true,
        paymentUrl: r.data.payUrl
      });

    } catch (e) {
      console.error('MOMO REPAY ERROR:', e.response?.data || e.message);
      return res.status(500).json({
        success: false,
        error: e.response?.data || e.message
      });
    }
  });
};


/**
 * =========================
 * OTHER APIs
 * =========================
 */
exports.getOrders = (req, res) => {
  Order.getByCustomerId(req.user.customer_id, (err, orders) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true, data: orders });
  });
};

exports.getOrderDetail = (req, res) => {
  Order.getOrderDetail(Number(req.params.id), req.user.customer_id, (err, order) => {
    if (err) return res.status(500).json({ success: false });
    if (!order) return res.status(404).json({ success: false });
    return res.json({ success: true, data: order });
  });
};

exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, orders) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true, data: orders });
  });
};

exports.getOrderDetailAdmin = (req, res) => {
  Order.getOrderDetailAdmin(Number(req.params.id), (err, order) => {
    if (err || !order) return res.status(404).json({ success: false });
    return res.json({ success: true, data: order });
  });
};

exports.updateOrderStatus = (req, res) => {
  Order.updateOrderStatus(Number(req.params.id), req.body.status, (err) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true });
  });
};

exports.cancelOrder = (req, res) => {
  Order.cancelOrder(Number(req.params.id), req.user.customer_id, (err) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true });
  });
};
