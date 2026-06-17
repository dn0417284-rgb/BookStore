import customerModel from "../models/customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const { email, full_name, password, phone, address } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu"
      });
    }

    // 1. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. create user
    const result = await customerModel.createCustomer({
      email,
      full_name,
      password: hashedPassword,
      phone,
      address
    });

    // 3. tạo token SAU KHI có result
    const token = jwt.sign(
      {
        customer_id: result.customer_id,
        email,
        role: "customer"
      },
      process.env.JWT_SECRET || "bookstore_secret_key",
      { expiresIn: "1d" }
    );

    // 4. trả response
    res.status(201).json({
      success: true,
      token,
      customer: result
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

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai mật khẩu"
      });
    }

    const { password: _, ...safeCustomer } = customer;

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      customer: safeCustomer
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