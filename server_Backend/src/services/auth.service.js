// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/auth.model');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const AuthService = {
  /**
   * Đăng ký tài khoản mới
   * - Kiểm tra email trùng
   * - Băm password bằng bcrypt
   * - Lưu DB và trả về token
   */
  register: async ({ full_name, email, password, phone, address }) => {
    // Validate cơ bản
    if (!full_name || !email || !password) {
      throw { status: 400, message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu.' };
    }
    if (password.length < 6) {
      throw { status: 400, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }

    // Kiểm tra email đã tồn tại
    const exists = await AuthModel.emailExists(email);
    if (exists) {
      throw { status: 409, message: 'Email này đã được đăng ký.' };
    }

    // Băm password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo customer trong DB
    const customer = await AuthModel.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Tạo JWT
    const token = jwt.sign(
      { customer_id: customer.customer_id, role: customer.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, customer };
  },

  /**
   * Đăng nhập
   * - Tìm customer theo email
   * - So sánh password với bcrypt
   * - Trả về token nếu hợp lệ
   */
  login: async ({ email, password }) => {
    if (!email || !password) {
      throw { status: 400, message: 'Vui lòng nhập email và mật khẩu.' };
    }

    // Tìm customer
    const customer = await AuthModel.findByEmail(email);
    if (!customer) {
      throw { status: 401, message: 'Email hoặc mật khẩu không đúng.' };
    }

    // Kiểm tra tài khoản bị khóa
    if (customer.account_status === 'locked') {
      throw { status: 403, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' };
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      throw { status: 401, message: 'Email hoặc mật khẩu không đúng.' };
    }

    // Tạo JWT — payload chứa customer_id + role (đúng format mà các controller khác dùng)
    const token = jwt.sign(
      { customer_id: customer.customer_id, role: customer.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _pw, ...customerInfo } = customer; // bỏ password khỏi response
    return { token, customer: customerInfo };
  },
};

module.exports = AuthService;