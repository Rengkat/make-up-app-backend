const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenVerified = (token) => jwt.verify(token, process.env.JWT_SECRET);
const attachTokenToResponse = ({ res, accessTokenPayload, refreshToken }) => {
  const accessTokenJWT = createJwt({ payload: { accessTokenPayload } });
  const refreshTokenJWT = createJwt({ payload: { accessTokenPayload, refreshToken } });

  const longTime = 1000 * 60 * 60 * 24 * 30;
  const shortTime = 1000 * 60 * 5;
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    maxAge: shortTime,
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + longTime),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};

module.exports = { isTokenVerified, attachTokenToResponse, createJwt };
