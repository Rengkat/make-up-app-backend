const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};
const isTokenVerified = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
const attachTokenToResponse = ({ res, userPayload }) => {
  const token = createJwt({ payload: userPayload });
  const expiringDate = 1000 * 60 * 60 * 2;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + expiringDate),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};
module.exports = { isTokenVerified, attachTokenToResponse, createJwt };
