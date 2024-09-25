const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  requestNewVerificationToken,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/new-verification", requestNewVerificationToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
module.exports = router;
