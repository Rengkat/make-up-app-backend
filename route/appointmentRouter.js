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
router.get("/user-appointments", authenticateUser, getUserAppointments);

router
  .route("/:id")
  .get(authenticateUser, authorizationPermission, getSingleAppointment)
  .patch(authenticateUser, updateAppointment)
  .delete(authenticateUser, authorizationPermission, deleteAppointment);
module.exports = router;
