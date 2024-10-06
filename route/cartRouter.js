const express = require("express");
const {
  addToCart,
  removeFromCart,
  getSingleCartProduct,
  getAllUserCartProducts,
  updateQuantity,
} = require("../controller/cartController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router.route("/").post(authenticateUser, addToCart).get(authenticateUser, getAllUserCartProducts);
router.delete("/remove-product", authenticateUser, removeFromCart);
router
  .route("/:id")
  .post(authenticateUser, addToCart)
  .get(authenticateUser, getSingleCartProduct)
  .patch(authenticateUser, updateQuantity);
module.exports = router;
