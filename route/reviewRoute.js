const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
} = require("../controller/reviewController");
const { authenticateUser } = require("../middleware/authentication");
router.route("/").post(authenticateUser, createReview).get(getAllReviews);
router.route("/:id").get(getSingleReview).patch(updateReview).delete(deleteReview);
module.exports = router;
