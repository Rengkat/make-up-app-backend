const CustomError = require("../errors");
const Wishlist = require("../model/wishlistModel");
const Product = require("../model/productModel");
const { StatusCodes } = require("http-status-codes");
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    //check if product is valid
    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      throw new CustomError.NotFoundError("Not found product with id " + productId);
    }
    const wishlistProductExist = await Wishlist.findOne({ product: productId, user: req.user.id });
    if (wishlistProductExist) {
      throw new CustomError.BadRequestError("Product already exist in the wishlist");
    }
    req.body.user = req.user.id;
    res.status(StatusCodes.CREATED).json({ message: "Product successfully added", success: true });
  } catch (error) {
    next(error);
  }
};
const removeFromWishlist = async (req, res, next) => {
  try {
    const { wishlistProductId } = req.params;
    const wishlistProduct = await Wishlist.findById(wishlistProductId);
    if (!wishlistProduct) {
      throw new CustomError.NotFoundError(`Not found product with id: ${wishlistProductId}`);
    }
    res.status(StatusCodes.OK).json({ message: "Product successfully removed", success: true });
  } catch (error) {
    next(error);
  }
};
const getSingleWishlistProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("reviews");
    if (!product) {
      throw new CustomError.BadRequestError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  getSingleWishlistProduct,
};
