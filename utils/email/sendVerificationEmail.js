const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ firstName, email, origin, verificationToken }) => {
  const link = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const message = `
    <p>Please confirm your email address by clicking the link below:</p>
    <a href="${link}" style="padding: 0.5rem 2rem; background: purple; border-radius: 7px; color: white; text-decoration: none;">Verify your email address</a>
    <p>If you did not sign up for a Fullybeauty account, you can simply disregard this email.</p>
    <p>Enjoy our services</p>
  `;

  return sendEmail({
    subject: "Email Verification",
    to: email,
    html: `<h4>Hello ${firstName},</h4>${message}`,
  });
};

module.exports = sendVerificationEmail;
