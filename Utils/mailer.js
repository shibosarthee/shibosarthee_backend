import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log('Attempting to send email...');
        console.log(`Recipient: ${to}, Subject: ${subject}`);

        // Create transporter with debug and logger options
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true, // Enable debug output
            logger: true // Enable logging
        });

        console.log('Transporter created, verifying connection...');

        // Verify transporter connection
        await transporter.verify((error, success) => {
            if (error) {
                console.error('Transporter verification failed:', error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

    let mailoption = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent, // ✅ explicitly HTML content
    }
   const info = await transporter.sendMail(mailoption);
    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};

export default sendEmail;
