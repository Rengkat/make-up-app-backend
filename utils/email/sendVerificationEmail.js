const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ firstName, email, origin, verificationToken }) => {
  const link = `${origin}/auth/verify-email?verificationToke=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clink on the link <a href=${link}>Verification link</a></p>`;

  return sendEmail({
    subject: "Email Verification",
    to: email,
    html: `<h4>Hello ${firstName}, 
    ${message}`,
  });
};
module.exports = sendVerificationEmail;
