const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getSingleWishlistProduct,
} = require("../controller/wishlistController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router.post("/", authenticateUser, addToWishlist);
router
  .route("/:id")
  .get(authenticateUser, getSingleWishlistProduct)
  .delete(authenticateUser, removeFromWishlist);
module.exports = router;
