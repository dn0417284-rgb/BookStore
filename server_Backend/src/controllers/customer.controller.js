import customerService from "../services/customer.service.js";

// Danh sách khách hàng -> trả về client
export const getCustomers = async (req, res) => {
  try {
    const customers = await customerService.getCustomers();

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
