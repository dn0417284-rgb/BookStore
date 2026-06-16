const AuthService = require('../services/auth.service');

const AuthController = {
  /**
   * POST /api/auth/register
   * Body: { full_name, email, password, phone?, address? }
   */
  register: async (req, res) => {
    try {
      const { full_name, email, password, phone, address } = req.body;
      const result = await AuthService.register({ full_name, email, password, phone, address });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công.',
        data: result,
      });
    } catch (err) {
      const status = err.status || 500;
      const message = err.message || 'Lỗi server, vui lòng thử lại.';
      return res.status(status).json({ success: false, message });
    }
  },

  /**
   * POST /api/auth/login
   * Body: { email, password }
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công.',
        data: result,
      });
    } catch (err) {
      const status = err.status || 500;
      const message = err.message || 'Lỗi server, vui lòng thử lại.';
      return res.status(status).json({ success: false, message });
    }
  },

  /**
   * GET /api/auth/me
   * Header: Authorization: Bearer <token>
   * Dùng để FE kiểm tra token còn hợp lệ không và lấy lại thông tin user
   */
  getMe: async (req, res) => {
    try {
      // req.user được gắn bởi auth.middleware.js (verifyToken)
      const AuthModel = require('../models/auth.model');
      const customer = await AuthModel.findByEmail(req.user.email).catch(() => null);

      // Fallback: trả thẳng payload từ JWT nếu không query được DB
      const userInfo = customer
        ? (({ password, ...rest }) => rest)(customer)
        : req.user;

      return res.status(200).json({ success: true, data: userInfo });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
  },
};

module.exports = AuthController;
// import bcrypt from 'bcryptjs';

// import {
//     findCustomerByEmail,
//     createCustomer
// } from '../models/customer.model.js';

// export const register = async (req, res) => {
//     try {
//         const {
//             email,
//             full_name,
//             password,
//             phone,
//             address
//         } = req.body;

//         if (!email || !full_name || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Vui lòng nhập đầy đủ thông tin'
//             });
//         }

//         const existingUser = await findCustomerByEmail(email);

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email đã tồn tại'
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await createCustomer({
//             email,
//             full_name,
//             password: hashedPassword,
//             phone,
//             address
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Đăng ký thành công'
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: 'Lỗi server'
//         });
//     }
// };