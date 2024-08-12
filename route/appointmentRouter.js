const express = require("express");
const {
  getAllAppointments,
  getSingleAppointment,
  getUserAppointments,
  updateAppointment,
  deleteAppointment,
  bookAppointment,
} = require("../controller/appointmentController");
const router = express.Router();
router.route("/").post(bookAppointment).get(getAllAppointments);
router
  .route("/:id")
  .get(getSingleAppointment)
  .get(getUserAppointments)
  .patch(updateAppointment)
  .delete(deleteAppointment);
module.exports = router;
