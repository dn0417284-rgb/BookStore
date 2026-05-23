import express from "express";
import { getCustomers } from "../controllers/customer.controller.js";
const router = express.Router();

//Get list-customers
router.get("/", getCustomers);
export default router;
