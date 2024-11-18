const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getAllUserOrders,
  updateOrder,
  getSingleOder,
} = require("../controller/orderController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizationPermission, getAllOrders);
router.get("/user-orders", authenticateUser, getAllUserOrders);
router.route("/:id").get(authenticateUser, getSingleOder).patch(authenticateUser, updateOrder);
