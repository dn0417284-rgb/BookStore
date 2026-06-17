import Address from '../models/address.model.js';

// GET ALL
export const getAddresses = async (req, res) => {
  try {

    const rows = await Address.getAllByCustomerId(
      req.user.customer_id
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Lỗi lấy địa chỉ',
      error: error.message
    });

  }
};

// CREATE
export const createAddress = async (req, res) => {

  try {

    const customerId =
      req.user.customer_id;

    req.body.customer_id =
      customerId;

    const duplicate =
      await Address.checkDuplicate(
        customerId,
        req.body.province,
        req.body.district,
        req.body.ward,
        req.body.address_detail
      );

    if (duplicate.length > 0) {

      return res.status(400).json({
        success: false,
        message: 'Bạn đã lưu địa chỉ này rồi'
      });

    }

    const result =
      await Address.create(req.body);

    res.json({
      success: true,
      address_id: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Lỗi thêm địa chỉ',
      error: error.message
    });

  }

};

// UPDATE
export const updateAddress = async (req, res) => {

  try {

    const addressId =
      Number(req.params.id);

    const customerId =
      req.user.customer_id;

    const duplicate =
      await Address.checkDuplicateForUpdate(
        addressId,
        customerId,
        req.body.province,
        req.body.district,
        req.body.ward,
        req.body.address_detail
      );

    if (duplicate.length > 0) {

      return res.status(400).json({
        success: false,
        message: 'Địa chỉ này đã tồn tại'
      });

    }

    await Address.update(
      addressId,
      customerId,
      req.body
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật',
      error: error.message
    });

  }

};

// DELETE
export const deleteAddress = async (req, res) => {

  try {

    await Address.delete(
      Number(req.params.id),
      req.user.customer_id
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Lỗi xóa',
      error: error.message
    });

  }

};

// SET DEFAULT
export const setDefaultAddress = async (req, res) => {

  try {

    await Address.setDefault(
      Number(req.params.id),
      req.user.customer_id
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Lỗi đặt mặc định',
      error: error.message
    });

  }

};