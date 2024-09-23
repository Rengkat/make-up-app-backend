const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html, origin }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const info = await transporter.sendMail({
    from: '"Alex" <maddison53@ethereal.email>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

module.exports = sendEmail;
