const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ firstName, email, resetPasswordToken, origin }) => {
  const link = `${origin}/auth/reset-password?resetToken=${resetPasswordToken}&email=${email}`;
  const message = `<p>Kindly reset your password by clicking the link below</p>
    <a href=${link}>Reset Password</a>
    <p> If you are not the person that made this request, kindly ignore</p>
    `;
  sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hey ${firstName},
        ${message}`,
  });
};
module.exports = sendResetPasswordEmail;
