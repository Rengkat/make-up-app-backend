const { StatusCodes } = require("http-status-codes");
const Appointment = require("../model/appointmentModel");
const CustomError = require("../errors");
const bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, time, service, type } = req.body;

    const appointment = await Appointment.create({
      user: userId,
      date,
      time,
      service,
      type,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Appointment successfully booked",
      appointment,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(StatusCodes.OK).json({ appointments, success: true });
  } catch (error) {
    next(error);
  }
};
const getUserAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findOne({ user: req.user.id });
    res.status(StatusCodes.OK).json({ appointments, success: true });
  } catch (error) {
    next(error);
  }
};
const getSingleAppointment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new CustomError.NotFoundError(`Appointment with id ${id} not found`);
    }

    res.status(StatusCodes.OK).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};
const updateAppointment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { date, time, service, type, status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new CustomError.NotFoundError(`Appointment with id ${id} not found`);
    }

    appointment.date = date !== undefined ? date : appointment.date;
    appointment.time = time !== undefined ? time : appointment.time;
    appointment.service = service !== undefined ? service : appointment.service;
    appointment.type = type !== undefined ? type : appointment.type;
    appointment.status = status !== undefined ? status : appointment.status;

    await appointment.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, appointment, message: "Appointment successfully updated" });
  } catch (error) {
    next(error);
  }
};
const deleteAppointment = async (req, res, next) => {
  const userId = req.params.id;
  const appointment = await Appointment.findByIdAndDelete(userId);

  if (!appointment) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Appointment not found" });
  }

  res.status(StatusCodes.OK).json({ success: true, message: "Appointment successfully deleted" });
};
module.exports = {
  getAllAppointments,
  getSingleAppointment,
  getUserAppointments,
  updateAppointment,
  deleteAppointment,
  bookAppointment,
};
