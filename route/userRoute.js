const express = require("express");
const {
  getAllUsers,
  getCurrentUserProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateCurrentUser,
} = require("../controller/userController");

const router = express.Router();
router.get("/", getAllUsers);
router.get("/profile", getCurrentUserProfile);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);
router.patch("/updatePassword", updateUserPassword);
router.patch("/updateCurrentUser", updateCurrentUser);
module.exports = router;
