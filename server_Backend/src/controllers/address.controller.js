import Address from '../models/address.model.js';

const getAddresses = (
  req,
  res
) => {

  Address.getAllByCustomerId(
    req.user.customer_id,
    (err, rows) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: 'Lỗi lấy địa chỉ'
        });

      }

      return res.json({
        success: true,
        data: rows
      });

    }
  );

};

const createAddress = (
  req,
  res
) => {

  req.body.customer_id =
    req.user.customer_id;

  Address.create(
    req.body,
    (err, result) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: 'Lỗi thêm địa chỉ'
        });

      }

      return res.json({
        success: true,
        address_id:
          result.insertId
      });

    }
  );

};

const updateAddress = (
  req,
  res
) => {

  Address.update(
    Number(req.params.id),
    req.user.customer_id,
    req.body,
    (err) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: 'Lỗi cập nhật'
        });

      }

      return res.json({
        success: true
      });

    }
  );

};

const deleteAddress = (
  req,
  res
) => {

  Address.delete(
    Number(req.params.id),
    req.user.customer_id,
    (err) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message: 'Lỗi xóa'
        });

      }

      return res.json({
        success: true
      });

    }
  );

};

const setDefaultAddress = (
  req,
  res
) => {

  Address.setDefault(
    Number(req.params.id),
    req.user.customer_id,
    (err) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message:
            'Lỗi đặt mặc định'
        });

      }

      return res.json({
        success: true
      });

    }
  );

};

export {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};