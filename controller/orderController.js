const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

// Create order
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

    // Initialize Paystack payment
    const response = await paystack.transaction.initialize({
      email: user.email,
      amount: total * 100, // Paystack uses kobo (1 kobo = 1/100th of a Naira)
    });

    // Create the order in the database
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

    // Respond with the Paystack authorization URL for the frontend to redirect to Paystack for payment
    res.status(StatusCodes.CREATED).json({
      status: "success",
      authorization_url: response.data.authorization_url,
      orderId: newOrder._id,
    });
  } catch (error) {
    next(error);
  }
};
const verifyTransaction = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      throw new CustomError.NotFoundError("Order not found");
    }

    // If the order is already paid, return early
    if (order.status === "paid") {
      return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Order already paid",
        data: order,
      });
    }

    // Verify the transaction with Paystack
    const response = await paystack.transaction.verify({ reference: order.paymentIntentId });

    if (response.data.status === "success") {
      // Update order status to paid
      order.status = "paid";
      await order.save();

      //clear the cart
      await Cart.deleteMany({ user: order.user });

      return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Payment verified successfully",
        data: order,
      });
    } else {
      // Update order status to failed if payment is unsuccessful
      order.status = "failed";
      await order.save();

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get all orders (for admin or other roles with appropriate permissions)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "fullName email"); // Populating user details (optional)
    res.status(StatusCodes.OK).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for the authenticated user
const getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("user", "fullName email");
    res.status(StatusCodes.OK).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single order by its ID
const getSingleOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("user", "fullName email")
      .populate("orderItems.product");
    if (!order) {
      throw new CustomError.NotFoundError("Order not found");
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update an order status (e.g., from 'pending' to 'shipped' or 'delivered')
const updateOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body; // e.g., 'shipped', 'delivered', 'canceled'

  try {
    if (!status) {
      throw new CustomError.BadRequestError("Status is required to update the order");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new CustomError.NotFoundError("Order not found");
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getAllUserOrders,
  getSingleOrder,
  updateOrder,
  verifyTransaction,
};
