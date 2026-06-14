import Cart from '../models/cart.model.js';

// GET CART
export const getCart = (req, res) => {

  const customerId =
    req.user.customer_id;

  Cart.getByCustomer(
    customerId,
    (err, results) => {

      if (err) {

        return res.status(500).json({
          message: 'Lỗi lấy giỏ hàng',
          error: err
        });

      }

      return res.status(200).json({
        success: true,
        data: results
      });

    }
  );

};

// ADD TO CART
export const addToCart = (req, res) => {

  const customerId = req.user.customer_id;

  const {
    product_id,
    quantity
  } = req.body;

  Cart.add(
    customerId,
    product_id,
    quantity,
    (err) => {

      if (err) {

        return res.status(500).json({
          message: 'Lỗi thêm giỏ hàng',
          error: err
        });

      }

      Cart.getByCustomer(
        customerId,
        (err2, results) => {

          if (err2) {

            return res.status(500).json({
              message: 'Lỗi lấy giỏ hàng',
              error: err2
            });

          }

          return res.status(201).json({
            success: true,
            data: results
          });

        }
      );

    }
  );

};

// UPDATE QUANTITY
export const updateQuantity = (req, res) => {

  const customerId =
    req.user.customer_id;

  const productId =
    req.params.productId;

  const {
    quantity
  } = req.body;

  Cart.updateQuantity(
    customerId,
    productId,
    quantity,
    (err) => {

      if (err) {

        return res.status(500).json({
          message: 'Lỗi cập nhật số lượng',
          error: err
        });

      }

      Cart.getByCustomer(
        customerId,
        (err2, results) => {

          if (err2) {

            return res.status(500).json({
              message: 'Lỗi lấy giỏ hàng',
              error: err2
            });

          }

          return res.status(200).json({
            success: true,
            data: results
          });

        }
      );

    }
  );

};

// REMOVE ITEM
export const removeItem = (req, res) => {

  const customerId =
    req.user.customer_id;

  const productId =
    req.params.productId;

  Cart.remove(
    customerId,
    productId,
    (err) => {

      if (err) {

        return res.status(500).json({
          message: 'Lỗi xóa sản phẩm',
          error: err
        });

      }

      Cart.getByCustomer(
        customerId,
        (err2, results) => {

          if (err2) {

            return res.status(500).json({
              message: 'Lỗi lấy giỏ hàng',
              error: err2
            });

          }

          return res.status(200).json({
            success: true,
            data: results
          });

        }
      );

    }
  );

};

// CLEAR CART
export const clearCart = (req, res) => {

  const customerId =
    req.user.customer_id;

  Cart.clear(
    customerId,
    (err) => {

      if (err) {

        return res.status(500).json({
          message: 'Lỗi xóa giỏ hàng',
          error: err
        });

      }

      return res.status(200).json({
        success: true,
        message: 'Đã xóa toàn bộ giỏ hàng'
      });

    }
  );

};