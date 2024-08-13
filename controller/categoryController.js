const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Category = require("../model/categoryModel");
const addCategory = async (req, res, next) => {
  try {
    const { name, product } = req.body;

    const existedCategory = await Category.findOne({ name });
    if (existedCategory) {
      throw new CustomError.BadRequestError("Category already exists");
    }

    const newCategory = await Category.create({ name, product });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Category added", success: true, category: newCategory });
  } catch (error) {
    next(error);
  }
};
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(StatusCodes.OK).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
const getSingleCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError.NotFoundError(`Category not found with ID ${categoryId}`);
    }
    res.status(StatusCodes.OK).json({ category, success: true });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new CustomError.NotFoundError(`Category not found with ID ${categoryId}`);
    }
    res.status(StatusCodes.OK).json({ message: "Category successfully deleted", success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
};
