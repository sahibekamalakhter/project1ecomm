import nodemailer from "nodemailer";

export const sendVerificationEmail = async (userEmail, userName, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const verifyUrl = process.env.CLIENT_URL + "/verify-email?token=" + token;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: "Confirm Your E-commerce Account",
    html: `
      <div>
        <p>Hello ${userName},</p>
        <p>Thank you for registering with our E-commerce website.</p>
        <p>Please click the button below to confirm your email address and activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;background-color:#1e88e5;color:white;text-decoration:none;border-radius:4px;">
            CONFIRM YOUR ACCOUNT
          </a>
        </p>
        <p>If you did not create this account, you can ignore this email.</p>
        <p>Thank you!</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
