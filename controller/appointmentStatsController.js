const Appointments = require("../model/appointmentModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const getAppointmentStats = async (req, res, next) => {
  try {
    const totalAppointments = await Appointments.countDocuments();
    const completedAppointments = await Appointments.countDocuments({ status: "delivered" });
    const pendingAppointments = await Appointments.countDocuments({ status: "pending" });
    const cancelledAppointments = await Appointments.countDocuments({ status: "cancelled" });
    const appointmentStats = [
      { name: "total appointments", counts: totalAppointments },
      { name: "completed appointments", counts: completedAppointments },
      { name: "pending appointments", counts: pendingAppointments },
      { name: "cancelled appointments", counts: cancelledAppointments },
    ];
    res.status(StatusCodes.OK).json({
      success: true,
      data: appointmentStats,
    });
  } catch (error) {
    next(error);
  }
};
const getAppointmentByService = async (req, res, next) => {
  try {
    const data = await Appointments.aggregate([
      {
        $group: {
          _id: "$service",
          total: { $sum: 1 },
        },
      },
    ]);
    const totalAppointments = data.reduce((acc, item) => acc + item.total, 0);
    const formattedData = data.map((item) => {
      const percentage = ((item.total / totalAppointments) * 100).toFixed(2);
      const degrees = ((item.total / totalAppointments) * 360).toFixed(2);
      return { service: item._id, total: item.total, percentage, degrees };
    });
    res.status(StatusCodes.OK).json({
      success: true,
      formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentByServiceType = async (req, res, next) => {
  try {
    const data = await Appointments.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
        },
      },
    ]);
    const totalAppointments = data.reduce((acc, item) => acc + item.total, 0);
    const formattedData = data.map((item) => {
      const percentage = ((item.total / totalAppointments) * 100).toFixed(2);
      const degrees = ((item.total / totalAppointments) * 360).toFixed(2);
      return { serviceType: item._id, total: item.total, percentage, degrees };
    });
    res.status(StatusCodes.OK).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getAppointmentStats, getAppointmentByService, getAppointmentByServiceType };
