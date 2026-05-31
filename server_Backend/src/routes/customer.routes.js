import express from "express";
import customerController from "../controllers/customer.controller.js";
const customerRoutes = express.Router();

//Get list-customers
customerRoutes.get("/", customerController.getCustomers);
//Delete customer
customerRoutes.delete("/:id", customerController.deleteCustomer);
export default customerRoutes;
