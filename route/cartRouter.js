const express = require("express");
const {
  addToCart,
  removeFromCart,
  getSingleCartProduct,
  getAllUserCartProducts,
  updatePrice,
} = require("../controller/cartController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router.route("/").post(authenticateUser, addToCart).get(authenticateUser, getAllUserCartProducts);
router
  .route("/:id")
  .get(authenticateUser, getSingleCartProduct)
  .delete(authenticateUser, removeFromCart)
  .patch(authenticateUser, updatePrice);
module.exports = router;
