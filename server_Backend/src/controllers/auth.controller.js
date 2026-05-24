import AuthService from '../services/auth.service.js';

const AuthController = {
  register: async (req, res) => {
    try {
      const { Email, MatKhau, HoTen, SoDienThoai, DiaChi } = req.body;

      if (!Email || !MatKhau || !HoTen) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đủ các trường bắt buộc!' });
      }

      const newUser = await AuthService.register({ Email, MatKhau, HoTen, SoDienThoai, DiaChi });
      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        data: newUser
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' });
      }

      const result = await AuthService.login(email, password);
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: result
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }
};

export default AuthController;