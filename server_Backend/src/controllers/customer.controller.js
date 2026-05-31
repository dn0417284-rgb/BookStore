import customerService from "../services/customer.service.js";
import customerModel from "../models/customer.model.js";

const customerController = {
  // lấy danh sách khách hàng
  getCustomers: async (req, res) => {
    try {
      const customers = await customerModel.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
      });
    }
  },
  //xóa khách hàng
  deleteCustomer: async (req, res) => {
    try {
      const id = req.params.id;

      await customerModel.deleteCustomer(id);

      res.status(200).json({
        success: true,
        message: "Xóa thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
};

export default customerController;
