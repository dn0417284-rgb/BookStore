import Address from '../models/address.model.js';

export const getAddresses = (
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

export const createAddress = (
  req,
  res
) => {

  const customerId =
    req.user.customer_id;

  req.body.customer_id =
    customerId;

  Address.checkDuplicate(
    customerId,
    req.body.province,
    req.body.district,
    req.body.ward,
    req.body.address_detail,
    (err, rows) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message:
            'Lỗi kiểm tra địa chỉ'
        });

      }

      if (rows.length > 0) {

        return res.status(400).json({
          success: false,
          message:
            'Bạn đã lưu địa chỉ này rồi'
        });

      }

      Address.create(
        req.body,
        (err, result) => {

          if (err) {

            return res.status(500).json({
              success: false,
              message:
                'Lỗi thêm địa chỉ'
            });

          }

          return res.json({
            success: true,
            address_id:
              result.insertId
          });

        }
      );

    }
  );

};

export const updateAddress = (
  req,
  res
) => {

  const addressId =
    Number(req.params.id);

  const customerId =
    req.user.customer_id;

  Address.checkDuplicateForUpdate(
    addressId,
    customerId,
    req.body.province,
    req.body.district,
    req.body.ward,
    req.body.address_detail,
    (err, rows) => {

      if (err) {

        return res.status(500).json({
          success: false,
          message:
            'Lỗi kiểm tra địa chỉ'
        });

      }

      if (rows.length > 0) {

        return res.status(400).json({
          success: false,
          message:
            'Địa chỉ này đã tồn tại'
        });

      }

      Address.update(
        addressId,
        customerId,
        req.body,
        (err) => {

          if (err) {

            return res.status(500).json({
              success: false,
              message:
                'Lỗi cập nhật'
            });

          }

          return res.json({
            success: true
          });

        }
      );

    }
  );

};

export const deleteAddress = (
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

export const setDefaultAddress = (
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