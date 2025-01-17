import { OAuth2Client } from "google-auth-library";

const getTokenInfo = async (token) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      return {
        status: "success",
        message: "Token Verified Successfully!",
        payload,
      };
    
  } catch (error) {
    return {
      status: "failed",
      message: error.message.split(":")[0]? error.message.split(":")[0]:"Something went wrong!",
    };
  }
};

export default getTokenInfo;