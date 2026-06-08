import db from '../config/db.js';

import Order from '../models/order.model.js';

import crypto from 'crypto';
import axios from 'axios';

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

const createOrder = (req, res) => {
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


const repayOrder = (req, res) => {
  const { order_id } = req.body;

  Order.getOrderDetail(order_id, req.user.customer_id, async (err, order) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB error', err });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (String(order.payment_status).toUpperCase() === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    const amountValue = Number(order.total_amount);

    if (isNaN(amountValue)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order amount'
      });
    }

    try {
      const amount = Math.round(amountValue);

      // placeholder cho payment gateway sau này
      return res.json({
        success: true,
        message: 'Ready for payment integration',
        data: {
          order_id: order.order_id,
          amount
        }
      });

    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: e.message
      });
    }
  });
};


const getOrders = (req, res) => {
  Order.getByCustomerId(
    req.user.customer_id,
    (err, orders) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true,
        data: orders
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

      if (!order) {
        return res.status(404).json({
          success: false
        });
      }

      return res.json({
        success: true,
        data: order
      });

    }
  );
};

const getAllOrders = (req, res) => {
  Order.getAllOrders(
    (err, orders) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true,
        data: orders
      });

    }
  );
};

const getOrderDetailAdmin = (req, res) => {
  Order.getOrderDetailAdmin(
    Number(req.params.id),
    (err, order) => {

      if (err || !order) {
        return res.status(404).json({
          success: false
        });
      }

      return res.json({
        success: true,
        data: order
      });
    }
  );
};

const updateOrderStatus = (req, res) => {
  Order.updateOrderStatus(
    Number(req.params.id),
    req.body.status,
    (err) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });
    }
  );
};

const cancelOrder = (req, res) => {
  Order.cancelOrder(
    Number(req.params.id),
    req.user.customer_id,
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      return res.json({
        success: true
      });
    }
  );
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