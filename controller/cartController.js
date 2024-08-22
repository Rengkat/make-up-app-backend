const CustomError = require("../errors");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const { StatusCodes } = require("http-status-codes");
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new CustomError.BadRequestError("Please provide product id and quantity");
    }

    const isValidProduct = await Product.findById(productId);
    if (!isValidProduct) {
      throw new CustomError.NotFoundError("No product found with id " + productId);
    }

    const cartProductExist = await Cart.findOne({ product: productId, user: req.user.id });
    if (cartProductExist) {
      throw new CustomError.BadRequestError("Product already exists in the cart");
    }

    await Cart.create({ product: productId, user: req.user.id, quantity });

    res.status(StatusCodes.CREATED).json({
      message: "Product successfully added to cart",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserCartProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ user: userId }).populate("product");

    res.status(StatusCodes.OK).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartProduct = await Cart.findById(id);
    if (!cartProduct) {
      throw new CustomError.NotFoundError(`Product not found in wishlist with id: ${id}`);
    }
    await Cart.findByIdAndDelete(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Product successfully removed from cart", success: true });
  } catch (error) {
    next(error);
  }
};

const getSingleCartProduct = async (req, res, next) => {
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
  addToCart,
  removeFromCart,
  getSingleCartProduct,
  getAllUserCartProducts,
};
