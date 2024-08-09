const CustomError = require("../errors/index");
const { isTokenVerified } = require("../utils");
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    CustomError.UnauthenticatedError("Authentication invalid");
  }
  try {
    const { firstName, surname, id, role } = isTokenVerified({ token });
    console.log({ firstName, surname, id, role });
    req.user = { firstName, surname, id, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};
module.exports = authenticateUser;
