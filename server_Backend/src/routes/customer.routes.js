import express from "express";
import customerController from "../controllers/customer.controller.js";

const router = express.Router();

// AUTH
router.post("/register", customerController.register);
router.post("/login", customerController.login);

// CUSTOMER
router.get('/customers', customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;