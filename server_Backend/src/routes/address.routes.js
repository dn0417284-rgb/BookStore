const express =
require('express');

const router =
express.Router();

const verifyToken =
require(
  '../middlewares/auth.middleware'
);

const {

  getAddresses,

  createAddress,

  updateAddress,

  deleteAddress,

  setDefaultAddress

} =
require(
  '../controllers/address.controller'
);

router.get(
  '/',
  verifyToken,
  getAddresses
);

router.post(
  '/',
  verifyToken,
  createAddress
);

router.put(
  '/:id',
  verifyToken,
  updateAddress
);

router.delete(
  '/:id',
  verifyToken,
  deleteAddress
);

router.put(
  '/:id/default',
  verifyToken,
  setDefaultAddress
);

module.exports =
router;