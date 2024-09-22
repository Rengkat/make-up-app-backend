const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  requestNewVerificationToken,
} = require("../controller/authController");
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/new-verification", requestNewVerificationToken);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;
