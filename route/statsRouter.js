const express = require("express");
const { getAllStats, getMonthlyAppointments } = require("../controller/statsController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.get("/", authenticateUser, authorizationPermission, getAllStats);
router.get(
  "/monthly-appointments",
  authenticateUser,
  authorizationPermission,
  getMonthlyAppointments
);
module.exports = router;
