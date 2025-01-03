const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getAllUserOrders,
  updateOrder,
  getSingleOrder,
  verifyTransaction,
} = require("../controller/orderController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizationPermission, getAllOrders);
router.get("/user-orders", authenticateUser, getAllUserOrders);
router.post("/verify/:id", authenticateUser, verifyTransaction);
router.route("/:id").get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);
module.exports = router;
