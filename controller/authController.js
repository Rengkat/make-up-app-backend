const User = require("../model/userModel");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors/index");
const { attachTokenToResponse, sendVerificationEmail } = require("../utils");
const createUserPayload = require("../utils/createUserPayload");
const crypto = require("crypto");

// const host = req.get("host");
// const forwardedHost = req.get("x-forwarded-host");
// const forwardedProtocol = req.get("x-forwarded-proto");
// console.log(host, forwardedHost, forwardedProtocol);
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
    const oneHour = 1000 * 60 * 60;
    const verificationTokenExpirationDate = new Date(Date.now() + oneHour);
    const user = await User.create({
      email,
      firstName,
      surname,
      password,
      verificationToken,
      verificationTokenExpirationDate,
    });

    //send verification email
    const origin = "http://localhost:3000";
    await sendVerificationEmail({
      firstName: user.firstName,
      email: user.email,
      origin,
      verificationToken: user.verificationToken,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Please check your email box and verify your email",
    });
  } catch (err) {
    next(err);
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.body;

    if (!email || !verificationToken) {
      throw new CustomError.BadRequestError("Please provide all details");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Check if the token has expired/ Javascript Stops
    const currentDate = new Date();
    if (currentDate > user.verificationTokenExpirationDate) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Verification fail. Please request a new token.",
      });
    }

    // Check if the verification token matches
    if (user.verificationToken !== verificationToken) {
      throw new CustomError.UnauthenticatedError("Verification failed");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpirationDate = null;

    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email successfully verified",
    });
  } catch (error) {
    next(error);
  }
};

const requestNewVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide an email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Generate a new token
    const newVerificationToken = crypto.randomBytes(40).toString("hex");
    const oneHour = 1000 * 60 * 60;
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpirationDate = new Date(Date.now() + oneHour);

    await user.save();

    // Send the new verification email
    // await sendVerificationEmail(user.email, newVerificationToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "A new verification token has been sent to your email.",
    });
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

module.exports = { registerUser, verifyEmail, requestNewVerificationToken, loginUser, logoutUser };
