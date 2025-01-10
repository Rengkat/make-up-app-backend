const express = require("express");
const {
  getAllStats,
  getMonthlyAppointments,
  getMonthlySales,
  getTotalAppointmentsServiceType,
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
module.exports = router;
