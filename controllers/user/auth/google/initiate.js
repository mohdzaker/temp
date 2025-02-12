import User from "../../../../models/User.js";
import Otp from "../../../../models/Otp.js";
import getTokenInfo from "../../../../utils/getTokenInfo.js";
import { generateOTP, getExpirationDate } from "../../../../utils/index.js";
import rateLimit from "../../../../utils/rateLimit.js";
import sendOTP from "../../../../utils/sendOtp.js";
import jwt from "jsonwebtoken";
import Referlist from "../../../../models/Referlist.js";  // Import Referlist model
import Config from "../../../../models/Config.js";
import Transaction from "../../../../models/Transaction.js";

const initiateGoogle = async (req, res) => {
  try {
    const { mobileNumber, google_token, referedBy= "huntcash", sms_hash, device_id = null } = req.body;
    console.log("sms hash: ", sms_hash);

    if (!mobileNumber || mobileNumber === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid mobile number!",
      });
    }

    if (mobileNumber.length > 10) {
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

    if (!sms_hash || sms_hash.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "SMS hash is required and cannot be empty!",
      });
    }

    const tokenInfo = await getTokenInfo(google_token);
      //  const tokenInfo = {
      //   payload: {
      //     iss: 'https://accounts.google.com',
      //     azp: '978014925661-mnl4nvrta816q5lu5b28f24s1ntvhibe.apps.googleusercontent.com',
      //     aud: '978014925661-hklnq6kjm59v1gjjh7oja74ef087nfck.apps.googleusercontent.com',
      //     sub: '112671659393143187213',
      //     email: 'indiangujrati90@gmail.com',
      //     email_verified: true,
      //     name: 'Oneshot IND',
      //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJl4eSOWGkq8NmbcDAp7w6Ojl-jusiC3mk_YUyBQxXfZyrGNJgF=s96-c',
      //     given_name: 'Oneshot',
      //     family_name: 'IND',
      //     iat: 1737005650,
      //     exp: 1737009250
      //   }
      //  }
    if (tokenInfo?.status === "failed") {
      return res.status(401).json({
        status: "failed",
        success: false,
        message: tokenInfo.message,
      });
    }

    
    const checkDevice = await User.findOne({
      where: {
        device_id
      }
    });

    
    const checkEmailExists = await User.findOne({
      where: { email: tokenInfo.payload.email },
    });

    if(checkEmailExists && checkDevice.id != checkEmailExists.id){
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Device already registered! Try using another device.",
      });
    }

    let referedById = null;

    if (referedBy && referedBy !== "huntcash") {
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
        checkReferCode.email === tokenInfo.payload.email
      ) {
        return res.status(403).json({
          status: "failed",
          message: "Self-referral is not allowed!",
        });
      }

      const config = await Config.findOne({
        where: {
          id: 1
        }
      });

      referedById = checkReferCode.id;

      await Referlist.create({
        user_id: checkReferCode.id, 
        referred_user_id: referedById,
        referal_name: checkReferCode.username, 
        referal_amount: config.per_refer,
      });
    }

    if (checkEmailExists) {
      if (checkEmailExists.mobileNumber != mobileNumber.toString()) {
        return res.status(400).json({
          status: "failed",
          message: "Email is already registered with another mobile number!",
        });
      }

      if (!checkEmailExists.isVerified) {
        await sendVerifyCode(mobileNumber, google_token, res, sms_hash);
      } else {
        const token = jwt.sign(
          { id: checkEmailExists.id },
          process.env.JWT_SECRET,
        );

        return res.status(200).json({
          status: 200,
          message: "Logged in successfully!",
          token,
        });
      }
    } else {
      const referCode = await generateReferCode();
      const newUser = await User.create({
        username: tokenInfo.payload.name,
        email: tokenInfo.payload.email,
        mobileNumber,
        profilePic: tokenInfo.payload.picture,
        referedBy: referedById || 0,
        referCode,
        isPromoUser: false,
        device_id,
      });
      const user = await User.findOne({
        where: {
          mobileNumber
        }
      })
      await Transaction.create({
        user_id: user.id,
        amount: 1,
        description: "Signup bonus",
        trans_type: "credit",
      });
      // Record the referral in Referlist when a new user is created
      if (referedById) {
        await Referlist.create({
          user_id: referedById,
          referred_user_id: newUser.id,
          referal_name: newUser.username,
          referal_amount: 100, // Example referral amount
        });
      }

      await sendVerifyCode(mobileNumber, google_token, res, sms_hash);
    }
  } catch (error) {
    console.error("Error during initiate:", error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};

export default initiateGoogle;

const sendVerifyCode = async (mobileNumber, google_token, res, sms_hash) => {
  try {
    console.log("here",sms_hash)
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

    const sendOtp = await sendOTP([mobileNumber], otpCode, sms_hash);

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
    console.error("Error during OTP sending:", error);
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
