const express = require("express");
const {
  addToCart,
  removeFromCart,
  getSingleCartProduct,
  getAllUserCartProducts,
} = require("../controller/cartController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router.route("/").post(authenticateUser, addToCart).get(authenticateUser, getAllUserCartProducts);
router
  .route("/:id")
  .get(authenticateUser, getSingleCartProduct)
  .delete(authenticateUser, removeFromCart);
module.exports = router;
