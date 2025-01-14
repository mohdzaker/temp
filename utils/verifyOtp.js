import Otp from "../models/Otp.js";

const verifyOtp = async (mobile_number, otp_code) => {
  try {
    if (!mobile_number || mobile_number == "") {
      return {
        status: "failed",
        success: false,
        message: "Please enter a valid mobile number!",
      };
    }

    if (!otp_code || otp_code == "") {
      return {
        status: "failed",
        success: false,
        message: "Please enter a valid verification code!",
      };
    }

    if (mobile_number.length < 10) {
      return {
        status: "failed",
        success: false,
        message: "Mobile number should be equal to 10 digits!",
      };
    }

    if (otp_code.length > 6) {
      return {
        status: "failed",
        success: false,
        message: "Invalied Verification Code!",
      };
    }

    const checkOtpExists = await Otp.findOne({
      where: {
        mobileNumber: mobile_number,
        otpCode: otp_code,
      },
    });

    if (!checkOtpExists) {
      return {
        status: "failed",
        success: false,
        message: "Invalid verification code!",
      };
    }

    const currentTime = new Date();
    if (currentTime > checkOtpExists.expiresAt) {
      return {
        status: "failed",
        success: false,
        message: "verification code has been expired!",
      };
    }

    return {
        status: "success",
        success: true,
        message: "Otp Verification was successful!"
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);

    return {
      status: "failed",
      success: false,
      message: error.response?.data?.message || "Something went wrong!",
    };
  }
};

export default verifyOtp;