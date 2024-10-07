const CustomError = require("../errors");
const Wishlist = require("../model/wishlistModel");
const Product = require("../model/productModel");
const { StatusCodes } = require("http-status-codes");
const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.body.productId || req.params.id;

    // Check if product is valid
    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      throw new CustomError.NotFoundError("No product found");
    }

    // Check if the product is already in the wishlist
    const wishlistProductExist = await Wishlist.findOne({ product: productId, user: req.user.id });
    if (wishlistProductExist) {
      throw new CustomError.BadRequestError("Product already exists in the wishlist");
    }

    // Add product to the wishlist
    await Wishlist.create({ product: productId, user: req.user.id });

    res.status(StatusCodes.CREATED).json({
      message: "Product successfully added to wishlist",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getUserWishlistProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ user: userId }).populate("product");

    res.status(StatusCodes.OK).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const wishlistProduct = await Wishlist.findById(id);
    if (!wishlistProduct) {
      throw new CustomError.NotFoundError(`Product not found in wishlist with id: ${id}`);
    }
    await Wishlist.findByIdAndDelete(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Product successfully removed from wishlist", success: true });
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
  getUserWishlistProducts,
};
