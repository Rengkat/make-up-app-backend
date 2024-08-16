const Product = require("../model/productModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const createProduct = async (req, res) => {
  await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Product successfully added" });
};
const getAllProducts = async (req, res, next) => {
  const products = await Product.find({}).populate("category", "name -_id");
  res.status(StatusCodes.OK).json({ products, success: true });
};

const getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError.BadRequestError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const { id: productId } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new CustomError.NotFoundError(`No product with id ${productId}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Product successfully updated", success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ success: true, message: "Success! Product removed." });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
