import Cart from '../models/cart.model.js';

// GET CART
export const getCart = async (req, res) => {
  try {

    const customerId = req.user.customer_id;

    const results =
      await Cart.getByCustomer(customerId);

    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi lấy giỏ hàng',
      error: error.message
    });

  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {

    const customerId =
      req.user.customer_id;

    const {
      product_id,
      quantity
    } = req.body;

    const results =
      await Cart.add(
        customerId,
        product_id,
        quantity
      );

    return res.status(201).json({
      success: true,
      data: results
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi thêm giỏ hàng',
      error: error.message
    });

  }
};

// UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
  try {

    const customerId =
      req.user.customer_id;

    const productId =
      req.params.productId;

    const {
      quantity
    } = req.body;

    const results =
      await Cart.updateQuantity(
        customerId,
        productId,
        quantity
      );

    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi cập nhật số lượng',
      error: error.message
    });

  }
};

// REMOVE ITEM
export const removeItem = async (req, res) => {
  try {

    const customerId =
      req.user.customer_id;

    const productId =
      req.params.productId;

    const results =
      await Cart.remove(
        customerId,
        productId
      );

    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi xóa sản phẩm',
      error: error.message
    });

  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {

    const customerId =
      req.user.customer_id;

    await Cart.clear(customerId);

    return res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng'
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Lỗi xóa giỏ hàng',
      error: error.message
    });

  }
};