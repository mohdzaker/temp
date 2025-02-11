import Referlist from "../../../../models/Referlist.js";
import User from "../../../../models/User.js";
import getTokenInfo from "../../../../utils/getTokenInfo.js";
import { getPhoneNumberDetails } from "../../../../utils/trueCallerUtils.js";
import jwt from "jsonwebtoken";
import Transaction from "../../../../models/Transaction.js";

const initiateTrueCallerCall = async (req, res) => {
  try {
    const { accessToken, google_token, referedBy = "huntcash", imei, device_id } = req.body;

    if (!accessToken || accessToken === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid access token!",
      });
    }

    if (!google_token || google_token === "") {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid Google token!",
      });
    }

    const checkDevice = await User.findOne({
      where: {
        imei,
        device_id
      }
    });

    if(checkDevice){
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Device already registered! Try using another device.",
      });
    }
    const phoneDetails = await getPhoneNumberDetails(accessToken);

    if (phoneDetails.status === "failed") {
      return res.status(401).json({
        status: "failed",
        success: false,
        message:
          phoneDetails.message || "Failed to fetch phone number details!",
      });
    }

    const phoneNumber = phoneDetails.data.phoneNumber;

    const tokenInfo = await getTokenInfo(google_token);
    if (tokenInfo?.status === "failed") {
      return res.status(401).json({
        status: "failed",
        success: false,
        message: tokenInfo.message,
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
        checkReferCode.email === tokenInfo.email
      ) {
        return res.status(403).json({
          status: "failed",
          message: "Self-referral is not allowed!",
        });
      }

      referedById = checkReferCode.id;

      await Referlist.create({
        user_id: checkReferCode.id, 
        referred_user_id: referedById,
        referal_name: checkReferCode.username, 
        referal_amount: config.per_refer,
      });
    }

    const checkUserExists = await User.findOne({
      where: { email: tokenInfo.email },
    });

    if (checkUserExists) {
      const token = jwt.sign(
        { id: checkUserExists.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        status: 200,
        message: "Logged in successfully!",
        token,
      });
    } else {
      // Create a new user
      const referCode = await generateReferCode();

      const newUser = await User.create({
        username: tokenInfo.name,
        email: tokenInfo.email,
        profilePic: tokenInfo.picture,
        phoneNumber,
        referedBy: referedById || 0,
        referCode,
        isVerified: true,
        isPromoUser: true,
        imei,
        device_id,
      });
      const user = User.findOne({
        where: {
          email,
        }
      });
      await Transaction.create({
        user_id: user.id,
        amount: 1,
        description: "Signup bonus",
        trans_type: "credit",
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET,);

      return res.status(201).json({
        status: 201,
        message: "Account created successfully!",
        token,
      });
    }
  } catch (error) {
    console.error("Error during initiate:", error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message || "An unexpected error occurred.",
    });
  }
};

export default initiateTrueCallerCall;

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
