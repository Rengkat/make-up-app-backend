const Brand = require("../model/brandModel");
CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const addBrand = async (req, res, next) => {
  try {
    const { name, product } = req.body;
    const existedBrand = await Brand.findOne({ name });
    if (existedBrand) {
      throw new CustomError.BadRequestError("Brand already exists");
    }
    const newBrand = await Brand.create({ name, product });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Brand added", success: true, brand: newBrand });
  } catch (error) {
    next(error);
  }
};
const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).select("name -_id");
    res.status(StatusCodes.OK).json({ success: true, brands });
  } catch (error) {
    next(error);
  }
};

const getSingleBrand = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId).populate("products");
    if (!brand) {
      throw new CustomError.NotFoundError(`Category not found with ID ${brandId}`);
    }
    res.status(StatusCodes.OK).json({ brand, success: true });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findByIdAndDelete(brandId);
    if (!brand) {
      throw new CustomError.NotFoundError(`Category not found with ID ${brandId}`);
    }
    res.status(StatusCodes.OK).json({ message: "Brand successfully deleted", success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { addBrand, getAllBrands, getSingleBrand, deleteBrand };
