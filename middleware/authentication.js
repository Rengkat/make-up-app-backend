const CustomError = require("../errors/index");
const { isTokenVerified } = require("../utils");
const attachTokenToResponse = require("../utils");
const authenticateUser = (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isTokenVerified(accessToken);
      req.user = payload;
      return next(); // if there is accessToken set user as payload, the program should just move to the next middleware,
      //no need to continue checking the next code block because i.e user is logged in
      // but since the accessToken life time is short, it might be expired.
      //in this case we will check the refreshToken and also check if it is valid
    }
    const payload = isTokenVerified(refreshToken);
    const existingToken = Token.findOne({
      user: payload.accessToken.id,
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
      refreshTokenPayload: existingToken?.refreshToken,
    });
    req.user = payload.accessToken;
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
