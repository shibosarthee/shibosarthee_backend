import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log('📩 Sending email via Resend...');

    const response = await resend.emails.send({
      from: 'shibosarthee@resend.dev', // You can replace with your verified domain email
      'shibosarthee@gmail.com',
      subject,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    throw error;
  }
};
