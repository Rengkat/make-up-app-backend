const User = require("../model/userModel");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors/index");
const { attachTokenToResponse } = require("../utils");
const createUserPayload = require("../utils/createUserPayload");
// const { token } = require("morgan");

const registerUser = async (req, res, next) => {
  try {
    const { email, firstName, surname, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const user = await User.create({ email, firstName, surname, password });

    res.status(StatusCodes.CREATED).json({
      success: true,

      message: "Successfully registered",
    });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
  ("");
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError.BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Please enter valid credentials");
    }

    const userPayload = createUserPayload(user);
    attachTokenToResponse({ res, userPayload });

    res.status(StatusCodes.OK).json({
      success: true,
      user: userPayload,
      message: "Successfully logged in",
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};
const logoutUser = (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
