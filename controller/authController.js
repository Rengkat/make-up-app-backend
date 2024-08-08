const User = require("../model/userModel");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors/index");
const { attachTokenToResponse } = require("../utils");
const createUserPayload = require("../utils/createUserPayload");

const registerUser = async (req, res, next) => {
  try {
    const { email, firstName, surname, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const user = await User.create({ email, firstName, surname, password });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
  ("");
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new CustomError.BadRequestError("Please provide email and password");
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  //   or use
  // if(user && (await user.comparePassword(password))){}
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Please enter valid credentials");
  }
  //to create payload instead of user._id, user.name, user.role
  const userPayload = createUserPayload(user);
  attachTokenToResponse({ res, userPayload });

  res.status(StatusCodes.OK).json({ success: true, user: userPayload });
};
const logoutUser = (req, res) => {};
module.exports = { registerUser, loginUser, logoutUser };
