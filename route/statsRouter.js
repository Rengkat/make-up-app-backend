const express = require("express");
const {
  getAllStats,
  getMonthlyAppointments,
  getMonthlySales,
  getTotalAppointmentsServiceType,
  getAppointmentServices,
  monthlyUserGrowth,
} = require("../controller/statsController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.get("/", authenticateUser, authorizationPermission, getAllStats);
router.get(
  "/monthly-appointments",
  authenticateUser,
  authorizationPermission,
  getMonthlyAppointments
);
router.get("/monthly-sales", authenticateUser, authorizationPermission, getMonthlySales);
router.get(
  "/appointment-type",
  authenticateUser,
  authorizationPermission,
  getTotalAppointmentsServiceType
);
router.get(
  "/monthly-appointment-service",
  authenticateUser,
  authorizationPermission,
  getAppointmentServices
);
router.get("/monthly-user-growth", authenticateUser, authorizationPermission, monthlyUserGrowth);
module.exports = router;
