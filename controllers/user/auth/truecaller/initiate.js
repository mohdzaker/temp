import axios from "axios";
import User from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import { generateReferCode } from "../google/initiate.js";

const fetchToken = async (authorizationCode, codeVerifier) => {
  try {
    const clientId = process.env.TRUECALLER_CLIENT_ID;
    const url = "https://oauth-account-noneu.truecaller.com/v1/token";

    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code: authorizationCode,
        code_verifier: codeVerifier,
      }),
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

const initiate = async (req, res) => {
  try {
    const { authorizationCode, codeVerifier, referedBy } = req.body;

    if (!authorizationCode?.trim()) {
      return res
        .status(400)
        .json({ status: "failed", message: "Authorization code is required!" });
    }

    if (!codeVerifier?.trim()) {
      return res
        .status(400)
        .json({ status: "failed", message: "Code verifier is required!" });
    }

    if (!referedBy?.trim()) {
      return res
        .status(400)
        .json({ status: "failed", message: "Referral code is required!" });
    }

    const checkReferCode = await User.findOne({
      where: { referCode: referedBy },
    });

    if (!checkReferCode) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid referral code!" });
    }

    const fetchAccessToken = await fetchToken(authorizationCode, codeVerifier);
    if (fetchAccessToken.status === "failed") {
      return res
        .status(400)
        .json({ status: "failed", message: fetchAccessToken.message });
    }

    const accessToken = fetchAccessToken.data.access_token;

    const fetchUserInfoResponse = await fetchUserInfo(accessToken);

    if (fetchUserInfoResponse.status === "failed") {
      return res
        .status(400)
        .json({ status: "failed", message: fetchUserInfoResponse.message });
    }

    const { phone_number, email, given_name, picture } =
      fetchUserInfoResponse.data;

    const existingUser = await User.findOne({
      where: { mobileNumber: phone_number, email },
    });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res
        .status(200)
        .json({ status: 200, message: "Logged in successfully!", token });
    } else {
      const referCode = await generateReferCode();
      const newUser = await User.create({
        username: given_name,
        email,
        mobileNumber: phone_number,
        profilePic: picture,
        referedBy: checkReferCode.id,
        referCode,
        isVerified: true,
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res
        .status(201)
        .json({ status: 201, message: "Registered successfully!", token });
    }
  } catch (error) {
    console.error("Error during initiate:", error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "An unexpected error occurred." });
  }
};

export default initiate;
