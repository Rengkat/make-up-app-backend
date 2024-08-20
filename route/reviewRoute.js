const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../route/reviewRoute");
const { authenticateUser } = require("../middleware/authentication");
router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router.route("/id").get(getSingleReview).patch(updateReview).delete(deleteReview);
module.exports = router;
