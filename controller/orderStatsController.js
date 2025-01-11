const User = require("../model/userModel");
const Appointments = require("../model/appointmentModel");
const Orders = require("../model/orderModel");
const { StatusCodes } = require("http-status-codes");
const getOrderStats = async (req, res, next) => {
  try {
    const count = await Orders.countDocuments();

    res.status(StatusCodes.OK).json({ success: true, totalOrders: count });
  } catch (error) {
    next(error);
  }
};
module.exports = { getOrderStats };
