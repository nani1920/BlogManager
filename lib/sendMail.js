/** @format */
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const PASS_KEY = process.env.PASS_KEY;

export const sendVerificationEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP service
      auth: {
        user: EMAIL_USER, // Your Gmail address
        pass: PASS_KEY, // App Password (if 2FA is enabled)
      },
    });

    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: "mksolutions110@gmail.com",
      to: email,
      subject: "Please verify your email",
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (e) {
    console.error("Error sending email:", error);
  }
};
