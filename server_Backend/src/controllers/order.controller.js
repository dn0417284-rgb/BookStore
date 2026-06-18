
import db from '../config/db.js';

import Order from '../models/order.model.js';
import crypto from 'crypto';
import axios from 'axios';

// Cấu hình bằng biến môi trường (env) để bảo mật, không hardcode key thật
const MOMO = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_ENDPOINT,
  ipnBase: process.env.MOMO_IPN_BASE
};

console.log('MOMO CONFIG:', {
  partnerCode: MOMO.partnerCode,
  endpoint: MOMO.endpoint,
  ipnBase: MOMO.ipnBase
});

function clean(v) {
  return String(v ?? '')
    .replace(/\s+/g, ' ')
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
    `&orderType=${p.orderType}` +
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

export const createOrder = async (req, res) => {
  try {
    req.body.customer_id = req.user.customer_id;//luu

    const orderId = await Order.create(req.body);//vao DB

    const method = req.body.payment_method;

    if (method === 'COD') {
      return res.json({
        success: true,
        orderId
      });
    }

    if (method !== 'MOMO') {
      return res.status(400).json({
        success: false,
        message: 'invalid payment'
      });
    }

    const ts = Date.now();

    const amount = String(
      Math.round(Number(req.body.total_amount))
    );

    const orderInfo = clean(
      `Thanh toan don hang ${orderId}`
    );

    const body = {//cbi dulieu gui momo
      partnerCode: MOMO.partnerCode,
      partnerName: 'Nha Sach BookStore',
      storeId: 'MomoTestStore',

      requestId: `${MOMO.partnerCode}_${ts}`,

      amount,

      orderId: `${orderId}_${ts}`,

      orderInfo,

      redirectUrl: `${MOMO.ipnBase}/payment-return`,

      ipnUrl: `${MOMO.ipnBase}/api/orders/momo-ipn`,

      extraData: '',

      requestType: 'payWithMethod',

      lang: 'vi'
    };

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
      .map(
        key =>
          `${key}=${fieldsToSign[key]}`
      )
      .join('&');

    body.signature = sign(rawSignature); //momo yc ký để xác thực

    const momoRes = await axios.post(
      MOMO.endpoint,//gọi API->cổng thanh toán
      body,
      {
        headers: {
          'Content-Type':
            'application/json'
        },
        timeout: 20000
      }
    );

    if (!momoRes.data?.payUrl) {

      console.error(
        'MOMO RESPONSE ERROR:',
        momoRes.data
      );

      return res.status(400).json({
        success: false,
        momo: momoRes.data
      });

    }

    return res.json({//về fr
      success: true,
      paymentUrl:
        momoRes.data.payUrl
    });

  } catch (e) {

    console.error(
      'CREATE ORDER ERROR:',
      e.response?.data || e.message
    );

    return res.status(500).json({
      success: false,
      error:
        e.response?.data ||
        e.message
    });

  }
};

export const momoIPN = async (req, res) => {
  try {

    console.log(
      'RECEIVED MOMO IPN:',
      req.body
    );

    const {
      orderId,
      resultCode,
      transId,
      signature: momoSignature
    } = req.body;

    const rawIpnSignature =
      buildIpnRawSignature(req.body);

    const mySignature =
      sign(rawIpnSignature);//ktra chu ky

    console.log(
      'CHỮ KÝ MoMo:',
      momoSignature
    );

    console.log(
      'CHỮ KÝ SERVER:',
      mySignature
    );

    if (mySignature !== momoSignature) {
      // console.log('MOMO:', momoSignature);
      // console.log('SERVER:', mySignature);
      // console.log('BODY:', req.body);

      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const realId = Number(
      orderId.split('_')[0]
    );

    const order =
      await Order.getOrderDetailAdmin(//tìm đơn hàng đó
        realId
      );

    if (!order) {

      console.error(
        `IPN Error: Order ${realId} not found in database.`
      );

      return res.status(404).json({
        message: 'Order not found'
      });

    }

    if (//ktra thanh toán
      order.payment_status ===
      'PAID'
    ) {

      console.log(
        `Order ${realId} was already paid.`
      );

      return res.status(204).send();

    }

    if (Number(resultCode) === 0) {//tc

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

      await db.execute(
        sqlUpdate,
        [
          orderId,
          String(transId),
          realId
        ]
      );

      console.log(
        ` Order ${realId} successfully updated`
      );

      return res.status(204).send();

    }

    const sqlFailed = `
      UPDATE orders
      SET
        status = 'FAILED',
        payment_status = 'UNPAID',
        failed_reason = 'Thanh toan MoMo that bai hoac bi huy'
      WHERE order_id = ?
    `;

    await db.execute(
      sqlFailed,
      [realId]
    );

    return res.status(204).send();

  } catch (err) {

    console.error(
      'MOMO IPN ERROR:',
      err
    );

    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });

  }
};

export const repayOrder = async (req, res) => {
  try {

    const { order_id } = req.body;

    const order = await Order.getOrderDetail(
      order_id,
      req.user.customer_id
    );

    if (!order) {
      return res.status(404).json({
        success: false
      });
    }

    if (order.payment_status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    if (
      order.status === 'CANCELLED' ||
      order.status === 'RECEIVED'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be repaid'
      });
    }

    const ts = Date.now();

    const amount = String(
      Math.round(
        Number(order.total_amount)
      )
    );

    const orderInfo = clean(
      `Thanh toan lai don hang ${order.order_id}`
    );

    const body = {
      partnerCode: MOMO.partnerCode,
      partnerName: 'Nha Sach BookStore',
      storeId: 'MomoTestStore',

      requestId: `${MOMO.partnerCode}_${ts}`,

      amount,

      orderId: `${order.order_id}_${ts}`,

      orderInfo,

      redirectUrl:
        `${MOMO.ipnBase}/payment-return`,

      ipnUrl:
        `${MOMO.ipnBase}/api/orders/momo-ipn`,

      extraData: '',

      requestType: 'payWithMethod',

      lang: 'vi'
    };

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

    const rawSignature = Object
      .keys(fieldsToSign)
      .sort()
      .map(
        key =>
          `${key}=${fieldsToSign[key]}`
      )
      .join('&');

    body.signature =
      sign(rawSignature);

    const momoRes =
      await axios.post(
        MOMO.endpoint,
        body,
        {
          headers: {
            'Content-Type':
              'application/json'
          },
          timeout: 20000
        }
      );

    if (!momoRes.data?.payUrl) {

      console.error(
        'MOMO REPAY RESPONSE ERROR:',
        momoRes.data
      );

      return res.status(400).json({
        success: false,
        momo: momoRes.data
      });

    }

    return res.json({
      success: true,
      paymentUrl:
        momoRes.data.payUrl
    });

  } catch (e) {

    console.error(
      'MOMO REPAY ERROR:',
      e.response?.data || e.message
    );

    return res.status(500).json({
      success: false,
      error:
        e.response?.data ||
        e.message
    });

  }
};


/**
 * =========================
 * OTHER APIs
 * =========================
 */
export const getOrders = async (req, res) => {

  try {

    const orders =
      await Order.getByCustomerId(
        req.user.customer_id
      );

    // console.log('ORDERS:', orders);

    return res.json({
      success: true,
      data: orders
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false
    });

  }

};

export const getOrderDetail = async (req, res) => {
  try {

    const order =
      await Order.getOrderDetail(
        Number(req.params.id),
        req.user.customer_id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });

    }

    return res.json({
      success: true,
      data: order
    });

  } catch (err) {

    console.error(
      'GET ORDER DETAIL ERROR:',
      err
    );

    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết đơn hàng'
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

export const getAllOrders = async (req, res) => {
  try {

    const orders =
      await Order.getAllOrders();

    return res.json({
      success: true,
      data: orders
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách đơn hàng'
    });

  }
};

export const getOrderDetailAdmin = async (
  req,
  res
) => {

  try {

    const order =
      await Order.getOrderDetailAdmin(
        Number(req.params.id)
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });

    }

    return res.json({
      success: true,
      data: order
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết đơn hàng'
    });

  }

};

export const updateOrderStatus = async (
  req,
  res
) => {

  try {

    await Order.updateOrderStatus(
      Number(req.params.id),
      req.body.status
    );

    return res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công'
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái đơn hàng'
    });

  }

};

export const cancelOrder = async (
  req,
  res
) => {

  try {

    await Order.cancelOrder(
      Number(req.params.id),
      req.user.customer_id
    );

    return res.json({
      success: true,
      message: 'Hủy đơn hàng thành công'
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        'Lỗi hủy đơn hàng'
    });

  }

};
