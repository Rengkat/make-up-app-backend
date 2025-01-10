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
const getMonthlyAppointments = async (req, res, next) => {
  try {
    const monthlyAppointments = await Appointments.aggregate([
      // Group by year and month and count the appointments
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      // Sort by year and month descending
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      // Limit to the last 6 months
      { $limit: 6 },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format the response with month names
    const formattedData = monthlyAppointments.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    res.status(StatusCodes.OK).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};
const getMonthlySales = async (req, res, next) => {
  try {
    const monthlySales = await Orders.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$total" },
        },
      },
      // Sort by year and month in descending order
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // Array to map numeric months to names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format the response to include month names
    const formattedData = monthlySales.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      totalSales: item.totalSales,
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStats, getMonthlyAppointments, getMonthlySales };
