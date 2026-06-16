import customerModel from "../models/customer.model.js";

const customerController = {
  getCustomers: async (req, res) => {
    try {
      const customers = await customerModel.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await customerModel.getCustomerById(req.params.id);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      await customerModel.updateCustomer(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      await customerModel.deleteCustomer(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const result = await customerModel.createCustomer(req.body);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email và mật khẩu không được để trống"
        });
      }

      const customer = await customerModel.login(email);

      if (!customer) {
        return res.status(401).json({
          success: false,
          message: "Email không tồn tại"
        });
      }

      if (customer.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Sai mật khẩu"
        });
      }

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        customer
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default customerController;