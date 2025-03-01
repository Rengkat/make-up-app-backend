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
const {
  getAppointmentStats,
  getAppointmentByService,
  getAppointmentByServiceType,
} = require("../controller/appointmentStatsController");
const router = express.Router();
router
  .route("/")
  .post(authenticateUser, bookAppointment)
  .get(authenticateUser, authorizationPermission, getAllAppointments);
router.get("/user-appointments", authenticateUser, getUserAppointments);
router.get("/stats", authenticateUser, authorizationPermission, getAppointmentStats);
router.get(
  "/appointment-services",
  authenticateUser,
  authorizationPermission,
  getAppointmentByService
);
router.get(
  "/appointment-services-type",
  authenticateUser,
  authorizationPermission,
  getAppointmentByServiceType
);

router
  .route("/:id")
  .get(authenticateUser, authorizationPermission, getSingleAppointment)
  .patch(authenticateUser, updateAppointment)
  .delete(authenticateUser, authorizationPermission, deleteAppointment);
module.exports = router;
