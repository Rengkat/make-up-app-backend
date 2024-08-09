const CustomError = require("../errors/index");
const { isTokenVerified } = require("../utils");
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
  try {
    const { firstName, surname, id, role } = isTokenVerified({ token });
    req.user = { firstName, surname, id, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};
const authorizationPermission = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  const error = new CustomError.UnauthorizedError("You are not authorized to access this route");
  next(error);
};

module.exports = { authenticateUser, authorizationPermission };
//e163fc84
