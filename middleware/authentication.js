const CustomError = require("../errors/index");
const { isTokenVerified } = require("../utils");
const { attachTokenToResponse } = require("../utils");
const Token = require("../model/Token");
const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenVerified(accessToken);

      req.user = payload.accessTokenPayload;
      return next(); // if there is accessToken set user as payload, the program should just move to the next middleware,
      //no need to continue checking the next code block because i.e user is logged in
      // but since the accessToken life time is short, it might be expired.
      //in this case we will check the refreshToken and also check if it is valid
    }
    // if the refreshToken is not there
    if (!refreshToken) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    const payload = isTokenVerified(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.accessTokenPayload.id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    // Now the refreshToken is present and valid then lets create another accessToken
    // Remember the accessTokenPayload is coming from create user and is going to create new token
    attachTokenToResponse({
      res,
      accessTokenPayload: payload.accessTokenPayload,
      refreshToken: existingToken?.refreshToken,
    });
    req.user = payload.accessTokenPayload;
    next();
  } catch (error) {
    next(error);
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
