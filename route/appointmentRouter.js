const express = require("express");
const {
  getAllAppointments,
  getSingleAppointment,
  getUserAppointments,
  updateAppointment,
  deleteAppointment,
  bookAppointment,
} = require("../controller/appointmentController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router
  .route("/")
  .post(authenticateUser, bookAppointment)
  .get(authenticateUser, authorizationPermission, getAllAppointments);
router
  .route("/:id")
  .get(getSingleAppointment)
  .get(getUserAppointments)
  .patch(updateAppointment)
  .delete(deleteAppointment);
module.exports = router;
