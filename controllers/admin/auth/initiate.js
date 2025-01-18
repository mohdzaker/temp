import User from "../../../../models/User.js";
import Otp from "../../../../models/Otp.js";
import { generateOTP, getExpirationDate } from "../../../../utils/index.js";
import rateLimit from "../../../../utils/rateLimit.js";
import sendOTP from "../../../../utils/sendOtp.js";
import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
  try {
    const { mobileNumber, sms_hash } = req.body;

    if (!mobileNumber || mobileNumber === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid mobile number!",
      });
    }

    if (mobileNumber.length > 10 || mobileNumber.length < 10) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Mobile number should be exactly 10 digits!",
      });
    }

    if (!sms_hash || sms_hash.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "SMS hash is required and cannot be empty!",
      });
    }

    const user = await User.findOne({
      where: { mobileNumber, role: "admin" },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Admin not found with this mobile number!",
      });
    }

    // Generate OTP and send it via SMS
    const otpCode = generateOTP();
    const expiresAt = getExpirationDate();

    // Rate limit check
    const limitCheck = await rateLimit(mobileNumber);
    if (limitCheck?.status === "failed") {
      return res.status(429).json({
        status: "failed",
        message: limitCheck.message,
      });
    }

    await Otp.create({
      mobileNumber,
      otpCode,
      expiresAt,
    });

    const sendOtpResponse = await sendOTP([mobileNumber], otpCode, sms_hash);

    if (sendOtpResponse.status === "success" && sendOtpResponse.success) {
      return res.status(201).json({
        status: 201,
        message: sendOtpResponse.message,
        request_id: sendOtpResponse.data.request_id,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: sendOtpResponse.message || "Failed to send OTP.",
      });
    }

  } catch (error) {
    console.error("Error during admin login:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred during admin login.",
    });
  }
};

export default adminLogin;
