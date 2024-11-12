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
    const category = await Category.findById(categoryId).populate("products");
    if (!category) {
      throw new CustomError.NotFoundError(`Category not found with ID ${categoryId}`);
    }
    res.status(StatusCodes.OK).json({ category, success: true });
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      throw new CustomError.BadRequestError("Please provide a category name.");
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new CustomError.NotFoundError("Category not found.");
    }

    res.status(StatusCodes.OK).json({
      message: "Category updated successfully",
      success: true,
      category,
    });
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
  updateCategory,
};
