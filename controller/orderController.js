const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../model/productModel");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const createOrder = async (req, res, next) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please provide tax and shipping fee");
  }

  let orderItems = [];
  let subtotal = 0;

  // Loop through cart items to get product details
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id : ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  // Calculate total order amount
  const total = tax + shippingFee + subtotal;

  // Initialize Paystack transaction
  const response = await paystack.transaction.initialize({
    email: req.user.email,
    amount: total * 100, // Convert total to kobo (Paystack uses kobo)
  });

  // Create the order in the database with Paystack reference and other details
  const newOrder = await Order.create({
    orderItems,
    tax,
    shippingFee,
    subtotal,
    total,
    user: req.user._id,
    clientSecret: response.data.authorization_url, // Store authorization_url in clientSecret temporarily
    paymentIntentId: response.data.reference, // Store the transaction reference
    status: "pending",
  });

  // Respond with Paystack authorization URL for redirection
  res.status(StatusCodes.CREATED).json({
    status: "success",
    authorization_url: response.data.authorization_url, // Redirect URL to Paystack payment page
    orderId: newOrder._id,
  });
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
