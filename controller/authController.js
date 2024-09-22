const User = require("../model/userModel");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors/index");
const { attachTokenToResponse } = require("../utils");
const createUserPayload = require("../utils/createUserPayload");
const crypto = require("crypto");

const registerUser = async (req, res, next) => {
  try {
    const { email, firstName, surname, password } = req.body;
    if (!email || !firstName || !surname || !password) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }
    const verificationToken = crypto.randomBytes(40).toString("hex");
    const tenMinutes = 1000 * 60 * 5;
    const verificationTokenExpirationDate = new Date(Date.now() + tenMinutes);
    await User.create({
      email,
      firstName,
      surname,
      password,
      verificationToken,
      verificationTokenExpirationDate,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Please verify your email",
    });
  } catch (err) {
    next(err);
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.body;
    if (!verificationToken || !email) {
      throw new CustomError.BadRequestError("Please provide all details");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
  } catch (error) {
    next(error);
  }
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

    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError("Please verify your email");
    }
    const userPayload = createUserPayload(user);
    attachTokenToResponse({ res, userPayload });

    res.status(StatusCodes.OK).json({
      success: true,
      user: userPayload,
      message: "Successfully logged in",
    });
  } catch (error) {
    next(error);
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

module.exports = { registerUser, verifyEmail, loginUser, logoutUser };
