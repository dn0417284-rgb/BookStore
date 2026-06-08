import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/auth.middleware.js";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/address.controller.js";

router.get("/", verifyToken, getAddresses);
router.post("/", verifyToken, createAddress);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);
router.put("/:id/default", verifyToken, setDefaultAddress);

export default router;