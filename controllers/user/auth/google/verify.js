import User from "../../../../models/User.js";
import verifyOtp from "../../../../utils/verifyOtp.js";
import jwt from "jsonwebtoken";

const verify = async (req, res) => {
  try {
    const { mobileNumber, otpCode } = req.body; 

    if (!mobileNumber || mobileNumber.trim() === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid mobile number!",
      });
    }

    if (mobileNumber.length !== 10) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Mobile number should be exactly 10 digits!",
      });
    }

    if (!otpCode || otpCode.trim() === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid OTP!",
      });
    }

    const verifyCode = await verifyOtp(mobileNumber, otpCode);

    if (verifyCode.status === "failed" || !verifyCode.success) {
      return res.status(401).json({
        status: "failed",
        success: false,
        message: verifyCode.message || "Invalid OTP!",
      });
    }

    const [updatedRows] = await User.update(
      { isVerified: true }, 
      { where: { mobileNumber } }
    );

    if (updatedRows > 0) {
      const user = await User.findOne({ where: { mobileNumber } });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found with that mobile number!",
        });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } 
      );

      return res.status(200).json({
        status: "success",
        message: "Logged in successfully!",
        token,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "User not found with that mobile number!",
      });
    }
  } catch (error) {
    console.error("Error in verify:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};

export default verify;
