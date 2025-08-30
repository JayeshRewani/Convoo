// utils/sendMail.js
import axios from "axios";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.SENDER_EMAIL, name: "Convoo Support" },
        to: [{ email }],
        subject,
        textContent: message,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY, // API Key from Brevo dashboard
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Email failed:", error.response?.data || error.message);
    throw error;
  }
};

export default sendEmail;
