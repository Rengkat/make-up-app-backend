const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Order = require("../model/orderModel");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const createOrder = async (req, res, next) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;

    // Fetch user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    if (!user.email) {
      throw new CustomError.BadRequestError("User email is required for payment initialization");
    }

    if (!cartItems || cartItems.length < 1) {
      throw new CustomError.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError("Please provide tax and shipping fee");
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const productId = item.product._id;
      const dbProduct = await Product.findOne({ _id: productId });

      if (!dbProduct) {
        throw new CustomError.NotFoundError(`No product with ID: ${productId}`);
      }

      const { name, price, image, _id } = dbProduct;
      const singleOrderItem = {
        amount: item.quantity,
        name,
        price,
        image,
        product: _id,
      };
      orderItems = [...orderItems, singleOrderItem];
      subtotal += item.subTotalAmount;
    }

    const total = tax + shippingFee + subtotal;

    const response = await paystack.transaction.initialize({
      email: user.email,
      amount: total * 100,
    });

    const newOrder = await Order.create({
      orderItems,
      tax,
      shippingFee,
      subtotal,
      total,
      user: req.user.id,
      clientSecret: response.data.authorization_url,
      paymentIntentId: response.data.reference,
      status: "pending",
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      authorization_url: response.data.authorization_url,
      orderId: newOrder._id,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  res.send("Get all orders");
};
const getAllUserOrders = async (req, res, next) => {
  res.send("get all user orders");
};
const getSingleOder = async (req, res, next) => {};
const updateOrder = async (req, res, next) => {};
module.exports = { createOrder, getAllOrders, getAllUserOrders, getSingleOder, updateOrder };
