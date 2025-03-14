import Withdraw from "../../../models/Withdraw.js";
import SecretKey from "../../../models/SecureKey.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

const callback = async (req, res) => {
  try {
    const { data } = req.body;
    const { secret_key } = req.query;

    const checkSecretKey = await SecretKey.findOne({ where: { secret_key } });

    if (!checkSecretKey) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or expired secret key!",
      });
    }

    if (!data?.upi || !data?.tnx_id || !data?.order_id || !data?.status) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid request data",
      });
    }

    const withdraw = await Withdraw.findOne({ where: { order_id: data.order_id } });

    if (!withdraw) {
      return res.status(404).json({
        status: "failed",
        message: "Withdrawal record not found",
      });
    }

    if (withdraw.status === data.status) {
      return res.json({
        status: "failed",
        message: "Callback already processed!",
      });
    }

    await withdraw.update({
      withdraw_status: data.status === "success" ? 0 : 1,
      status: data.status,
    });

    await sendNotificationToUser(
      "Withdraw Successful!",
      "Your withdrawal was successful!",
      withdraw.user_id
    );

    return res.json({
      status: "success",
      message: "Payment callback processed successfully",
    });
  } catch (error) {
    console.error("Payment Callback Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error processing payment callback",
    });
  }
};

export default callback;
