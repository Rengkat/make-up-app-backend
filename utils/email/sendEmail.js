const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport(nodemailerConfig);
    const info = await transporter.sendMail({
      from: '"Alex" <fullybeauty@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
