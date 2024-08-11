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
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");

const router = express.Router();
router.get("/", authenticateUser, authorizationPermission, getAllUsers);
router.get("/profile", authenticateUser, getCurrentUserProfile);
router.patch("/updatePassword", updateUserPassword);
router.patch("/updateCurrentUser", authenticateUser, updateCurrentUser);
router
  .route("/:userId")
  .get(authenticateUser, authorizationPermission, getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);
module.exports = router;
