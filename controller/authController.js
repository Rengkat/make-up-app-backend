const User = require("../model/userModel");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors/index");

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
const loginUser = (req, res) => {};
const logoutUser = (req, res) => {};
module.exports = { registerUser, loginUser, logoutUser };
