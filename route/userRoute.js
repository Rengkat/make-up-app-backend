const express = require("express");
const {
  getAllUsers,
  getCurrentUserProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} = require("../controller/userController");

const router = express.Router();
router.get("/", getAllUsers);
router.get("/profile", getCurrentUserProfile);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);
router.patch("/updatePassword", updateUserPassword);
