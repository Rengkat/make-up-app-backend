const { StatusCodes } = require("http-status-codes");
const User = require("../model/userModel");
const CustomError = require("../errors");
const { createUserPayload, attachTokenToResponse } = require("../utils");
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
const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new CustomError.NotFoundError(`No user with id: ${userId}`);
    return next(error);
  }
  res.status(StatusCodes.OK).json({ success: true, user });
};
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { firstName, surname, email, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Correctly update the user's properties with the new values
    user.firstName = firstName !== undefined ? firstName : user.firstName;
    user.surname = surname !== undefined ? surname : user.surname;
    user.email = email !== undefined ? email : user.email;
    user.role = role !== undefined ? role : user.role;

    await user.save();

    // Exclude the password from the response
    const { password, ...userWithoutPassword } = user.toObject();

    res.status(StatusCodes.OK).json({
      success: true,
      user: userWithoutPassword,
      message: "User successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

const updateCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, surname, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Correctly update the user's properties with the new values
    user.firstName = firstName !== undefined ? firstName : user.firstName;
    user.surname = surname !== undefined ? surname : user.surname;
    user.email = email !== undefined ? email : user.email;

    await user.save();

    const userPayload = createUserPayload(user);
    attachTokenToResponse({ res, userPayload });

    res.status(StatusCodes.OK).json({
      success: true,
      user: userPayload,
      message: "Your credential successfully updated",
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
  }

  res.status(StatusCodes.OK).json({ success: true, message: "User successfully deleted" });
};
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
