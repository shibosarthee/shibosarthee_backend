import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log("📩 Sending email via Nodemailer...");

    const mailOptions = {
      from: `"Shibosarthee" <${process.env.SMTP_USER}>`, // sender info
      to, // recipient email
      subject, // subject line
      html: htmlContent, // email HTML body
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email via Nodemailer:", error);
    throw error;
  }
};
