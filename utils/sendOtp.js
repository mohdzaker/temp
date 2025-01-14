import axios from "axios";

const sendOTP = async (mobileNumbers, otpCode) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "dlt",
        sender_id: "AFRUSH",
        message: "170019",
        variables_values: `${otpCode}`,
        flash: "0",
        numbers: mobileNumbers[0]
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      status: "success",
      success: true,
      message: "Verification code sent successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);

    return {
      status: "failed",
      success: false,
      message: error.response?.data?.message || "Something went wrong!",
    };
  }
};

export default sendOTP;
