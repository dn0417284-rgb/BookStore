import customerModel from "../models/customer.model.js";

//lay du lieu tu model
const customerService = {
  getCustomers: () => customerModel.getCustomers(),
};
export default customerService;
