import axios from "axios";

export const sendSMS = async (phone, otp) => {
  try {
    const response = await axios.post(
      `https://control.msg91.com/api/v5/otp`,
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: phone, // phone number with country code, e.g. 919876543210
        authkey: process.env.MSG91_AUTHKEY,
        otp: otp,
        expiry: process.env.MSG91_OTP_EXPIRY || 5,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OTP sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ MSG91 Error:", error.response?.data || error.message);
    throw new Error("Failed to send OTP via MSG91");
  }
};
