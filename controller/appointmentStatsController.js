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
module.exports = { getAppointmentStats };
