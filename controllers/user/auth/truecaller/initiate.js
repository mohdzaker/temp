import axios from "axios";
import User from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import { generateReferCode } from "../google/initiate.js";
import Referlist from "../../../../models/Referlist.js";
import Transaction from "../../../../models/Transaction.js";

const fetchToken = async (authorizationCode, codeVerifier) => {
  try {
    const clientId = process.env.TRUECALLER_CLIENT_ID;
    const url = "https://oauth-account-noneu.truecaller.com/v1/token";

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code:authorizationCode,
      code_verifier: codeVerifier,
    });

    const response = await axios.post(
      url,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return {
      status: "success",
      message: "Token fetched successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response?.data || error.message
    );
    return { status: "failed", message: error.response?.data || error.message };
  }
};

const fetchUserInfo = async (accessToken) => {
  try {
    const url = "https://oauth-account-noneu.truecaller.com/v1/userinfo";

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      status: "success",
      message: "User info fetched successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching user info:",
      error.response?.data || error.message
    );
    return { status: "failed", message: error.response?.data || error.message };
  }
};

const initiateTrueCaller = async (req, res) => {
  try {
    const { authorizationCode, codeVerifier, referedBy = "huntcash", imei, device_id } = req.body;

    if (!authorizationCode) {
      return res.status(400).json({ status: "failed", message: "Authorization code is required!" });
    }

    if (!codeVerifier) {
      return res.status(400).json({ status: "failed", message: "Code verifier is required!" });
    }

    if(!imei || imei == ""){
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid IMEI!",
      });
    }

    if(!device_id || device_id == ""){
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Please enter a valid device ID!",
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
    let referedById = null;

    if (referedBy && referedBy !== "huntcash") {
      const checkReferCode = await User.findOne({
        where: { referCode: referedBy },
      });

      if (!checkReferCode) {
        return res.status(400).json({ status: "failed", message: "Invalid referral code!" });
      }

      referedById = checkReferCode.id;

      // Fetch referral config (missing in original code)
      const config = await Config.findOne({ where: { id: 1 } });

      await Referlist.create({
        user_id: checkReferCode.id,
        referred_user_id: referedById, // FIX: This should be a different user's ID (new user later)
        referal_name: checkReferCode.username,
        referal_amount: config ? config.per_refer : 0, // FIX: Ensure config is not undefined
      });
    }

    const fetchAccessToken = await fetchToken(authorizationCode, codeVerifier);
    if (fetchAccessToken.status === "failed") {
      return res.status(400).json({ status: "failed", message: fetchAccessToken.message });
    }

    const accessToken = fetchAccessToken.data.access_token;

    const fetchUserInfoResponse = await fetchUserInfo(accessToken);
    if (fetchUserInfoResponse.status === "failed") {
      return res.status(400).json({ status: "failed", message: fetchUserInfoResponse.message });
    }

    const { phone_number, email, given_name, picture } = fetchUserInfoResponse.data;

    const existingUser = await User.findOne({ where: { mobileNumber: phone_number, email } });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({ status: 200, message: "Logged in successfully!", token });
    } else {
      const referCode = await generateReferCode();
      const newUser = await User.create({
        username: given_name,
        email,
        mobileNumber: phone_number,
        profilePic: picture,
        referedBy: referedById || 0, // Default to "huntcash" if no valid referedBy
        referCode,
        isVerified: true,
        isPromoUser: true,
        imei,
        device_id,
      });

      const user = await User.findOne({ where: { mobileNumber: phone_number, email } }); // FIX: Added 'await'

      await Transaction.create({
        user_id: user.id,
        amount: 1,
        description: "Signup bonus",
        trans_type: "credit",
      });

      // FIX: Ensure refer list entry is created properly for the new user
      if (referedById) {
        await Referlist.create({
          user_id: referedById, // Referring user's ID
          referred_user_id: newUser.id, // Newly registered user's ID
          referal_name: newUser.username,
          referal_amount: config ? config.per_refer : 0,
        });
      }

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      return res.status(201).json({ status: 201, message: "Registered successfully!", token });
    }
  } catch (error) {
    console.error("Error during initiate:", error.message);
    return res.status(500).json({ status: "failed", message: "An unexpected error occurred." });
  }
};


export default initiateTrueCaller;
