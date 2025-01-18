import User from "../../../../models/User.js";
import Otp from "../../../../models/Otp.js";
import verifyOtp from "../../../../utils/verifyOtp.js";
import jwt from "jsonwebtoken";

const verifyAdminOtp = async (req, res) => {
  try {
    const { mobileNumber, otpCode } = req.body;

    if (!mobileNumber || mobileNumber === "") {
      return res.status(400).json({
        status: "failed",
        message: "Please enter a valid mobile number!",
      });
    }

    if (mobileNumber.length !== 10) {
      return res.status(400).json({
        status: "failed",
        message: "Mobile number should be exactly 10 digits!",
      });
    }

    if (!otpCode || otpCode === "") {
      return res.status(400).json({
        status: "failed",
        message: "Please enter a valid OTP!",
      });
    }

    const verifyCode = await verifyOtp(mobileNumber, otpCode);

    if (verifyCode.status === "failed" || !verifyCode.success) {
      return res.status(401).json({
        status: "failed",
        message: verifyCode.message || "Invalid OTP!",
      });
    }

    const admin = await User.findOne({
      where: { mobileNumber, role: "admin" },
    });

    if (!admin) {
      return res.status(404).json({
        status: "failed",
        message: "Admin not found with this mobile number!",
      });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: "success",
      message: "Admin verified successfully!",
      token,
    });
  } catch (error) {
    console.error("Error in verifyAdminOtp:", error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};

export default verifyAdminOtp;
