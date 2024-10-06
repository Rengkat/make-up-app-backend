const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getSingleWishlistProduct,
  getUserWishlistProducts,
} = require("../controller/wishlistController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router
  .route("/")
  .post(authenticateUser, addToWishlist)
  .get(authenticateUser, getUserWishlistProducts);
router
  .route("/:id")
  .get(authenticateUser, getSingleWishlistProduct)
  .delete(authenticateUser, removeFromWishlist)
  .post(authenticateUser, addToWishlist);
module.exports = router;
