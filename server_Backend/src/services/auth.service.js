import AuthModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaToi_123';

const AuthService = {
  register: async (userData) => {
    const existingUser = await AuthModel.findByEmail(userData.Email);
    if (existingUser) {
      throw new Error('Email này đã được sử dụng bởi tài khoản khác!');
    }

    const newUserId = await AuthModel.createUser(userData);
    return { Idnguoi_dung: newUserId, ...userData };
  },

  login: async (Email, passwordInput) => {
    const user = await AuthModel.findByEmail(Email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }

    if (passwordInput !== user.MatKhau) {
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }

    const payload = {
      Idnguoi_dung: user.Idnguoi_dung,
      Email: user.Email,
      HoTen: user.HoTen
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return {
      token,
      user: {
        Idnguoi_dung: user.Idnguoi_dung,
        Email: user.Email,
        HoTen: user.HoTen,
        SoDienThoai: user.SoDienThoai,
        DiaChi: user.DiaChi
      }
    };
  }
};

export default AuthService;