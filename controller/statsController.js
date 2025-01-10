const User = require("../model/userModel");
const Appointments = require("../model/appointmentModel");
const Orders = require("../model/orderModel");
const { StatusCodes } = require("http-status-codes");
const getAllStats = async (req, res, next) => {
  try {
    const clients = await User.find({ role: "user" }).countDocuments();

    const appointments = await Appointments.find({ status: "delivered" }).countDocuments();
    const totalProductAggregate = await Orders.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$orderItems.amount" },
        },
      },
    ]);
    const totalProductSold = totalProductAggregate?.[0]?.totalSold || 0;

    const revenue = await Orders.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    const totalRevenue = revenue?.[0]?.totalRevenue || 0;

    res.status(StatusCodes.OK).json({ clients, appointments, totalProductSold, totalRevenue });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStats };
