import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/auth.model.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1m';

const AuthService = {
  /**
   * Đăng ký tài khoản mới
   * - Kiểm tra email trùng
   * - Băm password bằng bcrypt
   * - Lưu DB và trả về token
   */
  register: async ({ full_name, email, password, phone, address }) => {
  try {
    if (!full_name || !email || !password) {
      throw new Error('Thiếu thông tin bắt buộc');
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await AuthModel.findByEmail(cleanEmail);
    if (existing) {
      const err = new Error('Email đã tồn tại');
      err.status = 400;
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await AuthModel.create({
      full_name,
      email: cleanEmail,
      password: hash,
      phone,
      address,
    });

    const token = jwt.sign(
      {
        customer_id: user.customer_id,
        email: cleanEmail,
        role: 'user',
      },
      JWT_SECRET,
      { expiresIn: '1m' }
    );

    return {
      token,
      customer: {
        customer_id: user.customer_id,
        full_name: user.full_name,
        email: cleanEmail,
        role: 'user',
      },
    };

  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || 'Register failed',
    };
  }
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
    console.log('Login attempt:', email);
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
      throw {
        status: 401,
        message: "Sai mật khẩu"
      };
    }

    // Tạo JWT — payload chứa customer_id + role (đúng format mà các controller khác dùng)
    const token = jwt.sign(
      { customer_id: customer.customer_id, role: customer.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _pw, ...customerInfo } = customer;
    return { token, customer: customerInfo };
  },
};

export default AuthService;