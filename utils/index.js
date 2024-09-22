const createUserPayload = require("./createUserPayload");
const sendEmail = require("./email/sendEmail");
const sendVerificationEmail = require("./email/sendVerificationEmail");
const { attachTokenToResponse, createJwt, isTokenVerified } = require("./jwt");

module.exports = {
  attachTokenToResponse,
  createJwt,
  isTokenVerified,
  createUserPayload,
  sendEmail,
  sendVerificationEmail,
};
