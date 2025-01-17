const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");
const { getSingleProductReview } = require("../controller/reviewController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const { getProductStats, getSalesByCategory } = require("../controller/productStatsController");
router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizationPermission, createProduct);
router.route("/uploadImage").post(authenticateUser, authorizationPermission, uploadImage);
router.route("/stats").get(authenticateUser, authorizationPermission, getProductStats);
router
  .route("/sales-by-category")
  .get(authenticateUser, authorizationPermission, getSalesByCategory);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizationPermission, updateProduct)
  .delete(authenticateUser, authorizationPermission, deleteProduct);
router.get("/:id/reviews", getSingleProductReview);
module.exports = router;
