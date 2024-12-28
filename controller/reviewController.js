const Product = require("../model/productModel");
const Review = require("../model/reviewModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const createReview = async (req, res, next) => {
  try {
    const { product: productId, comment, rating } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError.NotFoundError(`Product not found`);
    }

    // Ensure the user has not already reviewed the product
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      throw new CustomError.BadRequestError("You have already reviewed this product!");
    }

    // Add the user ID to the review body
    const reviewData = {
      user: req.user.id,
      product: productId,
      comment,
      rating,
    };

    // Create the review
    const review = await Review.create(reviewData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  const { productId } = req.query;
  try {
    const reviews = await Review.find({ product: productId }).populate("product");

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
    const reviewExist = await Review.findById(reviewId);
    if (!reviewExist) {
      throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }
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
