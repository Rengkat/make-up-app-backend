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
const { getOrderStats,getAllOrdersOverTime,getBestSaleProduct,getTotalRevenue } = require("../controller/orderStatsController");
router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizationPermission, getAllOrders);
router.get("/stats", authenticateUser, authorizationPermission, getOrderStats);
router.get("/orders-monthly-stats", authenticateUser, authorizationPermission, getAllOrdersOverTime);
router.get("/best-selling-product", authenticateUser, authorizationPermission, getBestSaleProduct);
router.get("/revenue-overtime", authenticateUser, authorizationPermission, getTotalRevenue);
router.get("/user-orders", authenticateUser, getAllUserOrders);
router.post("/verify/:id", authenticateUser, verifyTransaction);
router.route("/:id").get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);
module.exports = router;
