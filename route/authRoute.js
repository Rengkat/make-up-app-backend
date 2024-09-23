const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  requestNewVerificationToken,
  testSendingMail,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const router = express.Router();
router.post("/testing-email", testSendingMail);
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/new-verification", requestNewVerificationToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;
