import AuthService from '../services/auth.service.js';
import AuthModel from '../models/auth.model.js';

const AuthController = {
  /**
   * POST /api/auth/register
   */
  register: async (req, res) => {
    try {
      const { full_name, email, password, phone, address } = req.body;

      const result = await AuthService.register({
        full_name,
        email,
        password,
        phone,
        address,
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: result,
      });
    } catch (err) {
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Lỗi server',
      });
    }
  },

  /**
   * POST /api/auth/login
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
console.log('Login attempt:', email);
      const result = await AuthService.login({ email, password });

    
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        token: result.token,
        customer: result.customer,
      });
    } catch (err) {
      return res.status(err.status || 401).json({
        success: false,
        message: err.message || 'Sai email hoặc mật khẩu',
      });
    }
  },

  /**
   * GET /api/auth/me
   * Middleware JWT phải set req.user
   */
  getMe: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      return res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
      });
    }
  },
};

export default AuthController;