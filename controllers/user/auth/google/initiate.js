import User from "../../../../models/User.js";
import Otp from "../../../../models/Otp.js";
import getTokenInfo from "../../../../utils/getTokenInfo.js";
import { generateOTP, getExpirationDate } from "../../../../utils/index.js";
import rateLimit from "../../../../utils/rateLimit.js";
import sendCode from "../../../../utils/sendOtp.js";
import jwt from "jsonwebtoken";

const initiate = async (req, res) => {
  try {
    const { mobileNumber, google_token, referedBy } = req.body; 

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

    if (!google_token || google_token.trim() === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid Google token!",
      });
    }

    if (!referedBy || referedBy.trim() === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid referral code!",
      });
    }

    const tokenInfo = await getTokenInfo(google_token);
    // const tokenInfo = {
    //   iss: 'https://accounts.google.com',
    //   azp: '978014925661-mnl4nvrta816q5lu5b28f24s1ntvhibe.apps.googleusercontent.com',
    //   aud: '978014925661-hklnq6kjm59v1gjjh7oja74ef087nfck.apps.googleusercontent.com',
    //   sub: '112671659393143187213',
    //   email: 'indiangujrati90@gmail.com',
    //   email_verified: true,
    //   name: 'Oneshot IND',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJl4eSOWGkq8NmbcDAp7w6Ojl-jusiC3mk_YUyBQxXfZyrGNJgF=s96-c',
    //   given_name: 'Oneshot',
    //   family_name: 'IND',
    //   iat: 1737005650,
    //   exp: 1737009250
    // }
    
    if (tokenInfo?.status === "failed") {
      return res.status(401).json({
        status: "failed",
        success: false,
        message: tokenInfo.message,
      });
    }

    const checkEmailExists = await User.findOne({
      where: { email: tokenInfo.email },
    });

    const checkReferCode = await User.findOne({
      where: { referCode: referedBy },
    });

    if (!checkReferCode) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid referral code!",
      });
    }

    if (
      checkReferCode.referCode === referedBy &&
      checkReferCode.email === tokenInfo.email
    ) {
      return res.status(403).json({
        status: "failed",
        message: "Self-referral is not allowed!",
      });
    }

    if (checkEmailExists) {
      if (mobileNumber !== checkEmailExists.mobileNumber) {
        return res.status(400).json({
          status: "failed",
          message: "Email is already registered with another mobile number!",
        });
      }

      if (!checkEmailExists.isVerified) {
        await sendVerifyCode(mobileNumber, google_token, res);
      } else {
        const token = jwt.sign(
          { id: checkEmailExists.id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" } 
        );

        return res.status(200).json({
          status: 200,
          message: "Logged in successfully!",
          token,
        });
      }
    } else {
      const referCode = await generateReferCode();
      await User.create({
        username: tokenInfo.name,
        email: tokenInfo.email,
        mobileNumber,
        profilePic: tokenInfo.picture,
        referedBy: checkReferCode.id, 
        referCode,
      });
      await sendVerifyCode(mobileNumber, google_token, res);
    }
  } catch (error) {
    console.error("Error during initiate:", error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};

export default initiate;

const sendVerifyCode = async (mobileNumber, google_token, res) => {
  try {
    const otpCode = generateOTP();
    const expiresAt = getExpirationDate();

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
      google_token,
      expiresAt,
    });

    const sendOtp = await sendCode([mobileNumber], otpCode);

    if (sendOtp.status === "success" && sendOtp.success) {
      return res.status(201).json({
        status: 201,
        message: sendOtp.message,
        request_id: sendOtp.data.request_id,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: sendOtp.message || "Failed to send OTP.",
      });
    }
  } catch (error) {
    console.error("Error during OTP sending:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "An unexpected error occurred during OTP generation.",
    });
  }
};

export const generateReferCode = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referCode;
  do {
    referCode = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referCode += characters[randomIndex];
    }
  } while (await User.findOne({ where: { referCode } })); 
  return referCode;
};