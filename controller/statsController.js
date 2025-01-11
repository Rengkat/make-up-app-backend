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
const getTotalAppointmentsServiceType = async (req, res, next) => {
  try {
    // Aggregate the total count for each service type
    const appointmentsType = await Appointments.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }, // Count the number of appointments for each type
        },
      },
    ]);

    // Calculate the total number of appointments
    const totalAppointments = appointmentsType.reduce((acc, curr) => acc + curr.count, 0);

    // Calculate the percentage and degrees for each service type
    const formatted = appointmentsType.map((item) => {
      const percentage = ((item.count / totalAppointments) * 100).toFixed(2); // Percentage
      const degrees = ((item.count / totalAppointments) * 360).toFixed(2); // Degrees for pie chart
      return {
        serviceType: item._id, // Type of service
        count: item.count, // Count of appointments
        percentage, // Percentage representation
        degrees, // Degree representation for pie chart
      };
    });

    // Send the response
    res.status(StatusCodes.OK).json({
      success: true,
      totalAppointments,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};
const getAppointmentServices = async (req, res, next) => {
  try {
    const services = await Appointments.aggregate([
      {
        $group: {
          _id: {
            service: "$service",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
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
    const totalServices = services.reduce((acc, curr) => acc + curr.count, 0);

    const formatted = services.map((item) => {
      const percentage = ((item.count / totalServices) * 100).toFixed(2);
      const degrees = ((item.count / totalServices) * 360).toFixed(2);
      return {
        service: item._id.service,
        year: item._id.year,
        month: monthNames[item._id.month - 1],
        count: item.count,
        degrees,
        percentage,
      };
    });

    res.status(StatusCodes.OK).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};
const monthlyUserGrowth = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          isVerified: true,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
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
    const formatted = users.map((user) => {
      return {
        year: user._id.year,
        month: monthNames[user._id.month - 1],
        count: user.count,
      };
    });
    res.status(StatusCodes.OK).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllStats,
  getMonthlyAppointments,
  getMonthlySales,
  getTotalAppointmentsServiceType,
  getAppointmentServices,
  monthlyUserGrowth,
};
