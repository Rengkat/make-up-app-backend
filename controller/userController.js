const { StatusCodes } = require("http-status-codes");
const User = require("../model/userModel");
const CustomError = require("../errors");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
const getCurrentUserProfile = async (req, res, next) => {
  const currentUser = await User.findById({ _id: req.user.id }).select("-password");
  if (!currentUser) {
    const error = new CustomError.NotFoundError("User not found");
    next(error);
  }
  res.status(StatusCodes.OK).json({ success: true, user: currentUser });
};
const getSingleUser = (req, res, next) => {};
const updateUser = (req, res, next) => {};
const updateCurrentUser = (req, res, next) => {};
const deleteUser = (req, res, next) => {};
const updateUserPassword = (req, res, next) => {};
module.exports = {
  getAllUsers,
  getCurrentUserProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateCurrentUser,
};
