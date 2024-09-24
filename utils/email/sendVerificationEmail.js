const sendEmail = require("./sendEmail");
const sendVerificationEmail = async ({ firstName, email, origin, verificationToken }) => {
  const link = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const html = `
    <body
    style="
      padding: 0;
      margin: 0;
      background-color: #f4f4f4;
      width: 100%;
    ">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto;">
        <tr>
          <td style="padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #dddddd; background: #fffbf1;">
              <tr>
                <td style="background: #dd6f1d; padding: 1.5rem; text-align: center;">
                  <a href="${origin}" style="display: inline-block;color: white; text-decoration: none; font-size: larger">
          FULLBEAUTY</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 1.5rem;">
                  <p style="font-size: 16px; line-height: 1.5;">Hello ${firstName},</p>
                  <p style="font-size: 16px; line-height: 1.5;">
                    Welcome to Fullbeauty. Please verify your email by clicking on the link below.
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a
                      href="${link}"
                      style="
                        background: #c86011;
                        border-radius: 7px;
                        padding: 0.8rem 1.2rem;
                        color: white;
                        font-size: 16px;
                        text-decoration: none;
                        display: inline-block;
                      ">
                      Verify Your Email Address
                    </a>
                  </div>
                  <p style="font-size: 14px; line-height: 1.5;">
                    If you didn't request this email, please ignore it.
                  </p>
                  <p style="font-size: 14px; line-height: 1.5;">
                    Regards, <br />
                    Fullbeauty
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;

  return sendEmail({
    subject: "Email Verification",
    to: email,
    html,
  });
};

module.exports = sendVerificationEmail;
