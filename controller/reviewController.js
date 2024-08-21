const Product = require("../model/productModel");
const Review = require("../model/reviewModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const createReview = async (req, res, next) => {
  try {
    const { product: productId } = req.body;

    // Check if product is valid
    const isProductValid = await Product.findOne({ _id: productId });
    if (!isProductValid) {
      throw new CustomError.NotFoundError(`Not found product with id: ${productId}`);
    }

    // Check if review has been added by the same user for the same product
    const existedReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existedReview) {
      throw new CustomError.BadRequestError("You have reviewed this product already!");
    }

    req.body.user = req.user.id; // Add userId to the request body to add them at the same time
    await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ success: true, message: "Review submitted" });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({});

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getSingleReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate("product");
    if (!review) {
      throw new CustomError.NotFoundError(`Not found product with id: ${id}`);
    }
    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    next(error);
  }
};
const updateReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const { comment, rating } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new CustomError.NotFoundError(`Not found review with id: ${reviewId}`);
    }
    if (comment) {
      review.comment = comment;
    }
    if (rating) {
      review.rating = rating;
    }

    await review.save();
    res.status(StatusCodes.OK).json({ message: "review edited", review });
  } catch (error) {
    next(error);
  }
};
const deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;

    // Check if the review exists
    const review = await Review.findById(reviewId);

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.status(StatusCodes.OK).json({ message: "Review deleted", success: true });
  } catch (error) {
    next(error);
  }
};
const getSingleProductReview = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
