const Address =
require('../models/address.model');

exports.getAddresses = (
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

exports.createAddress = (
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

exports.updateAddress = (
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

exports.deleteAddress = (
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

exports.setDefaultAddress = (
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