const express = require("express");
const {
  getAllUsers,
  getCurrentUserProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateCurrentUser,
  addAddressToUser,
  updateAddress,
  deleteAddress,
  getSingleAddress,
} = require("../controller/userController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");

const router = express.Router();
router.get("/", authenticateUser, authorizationPermission, getAllUsers);
router.get("/profile", authenticateUser, getCurrentUserProfile);
router
  .route("/address")
  .put(authenticateUser, addAddressToUser)
  .delete(authenticateUser, deleteAddress);
router.patch("/updatePassword", authenticateUser, updateUserPassword);
router.patch("/updateCurrentUser", authenticateUser, updateCurrentUser);
router.patch("/updateAddress", authenticateUser, updateAddress);

router
  .route("/:userId")
  .get(authenticateUser, authorizationPermission, getSingleUser)
  .patch(authenticateUser, authorizationPermission, updateUser)
  .delete(authenticateUser, authorizationPermission, deleteUser);
router.patch("/address/:addressId", authenticateUser, getSingleAddress);
module.exports = router;
