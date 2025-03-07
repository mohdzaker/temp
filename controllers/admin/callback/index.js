import Withdraw from "../../../models/Withdraw.js";
import SecretKey from "../../../models/SecureKey.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

const callback = async (req, res) => {
  try {
    const { data } = req.body;
    const { secret_key } = req.query;

    // Validate secret key
    const checkSecretKey = await SecretKey.findOne({
      where: {
        secret_key,
      },
    });

    if (!checkSecretKey) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or expired secret key!",
      });
    }

    // Validate request data
    if (!data || !data.upi || !data.tnx_id || !data.order_id || !data.status) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find the withdrawal record
    const withdraw = await Withdraw.findOne({
      where: { order_id: data.order_id },
    });

    if (!withdraw) {
      return res.status(404).json({ message: "Withdrawal record not found" });
    }

    // Update the withdrawal status based on payment status
    await withdraw.update({
      withdraw_status: data.status === "success" ? 0 : 1,
      status: data.status,
    });

    await sendNotificationToUser("Withdraw success!", "Your withdraw was successfull!", withdraw.user_id);
    return res.json({
      status: "success",
      message: "Payment callback processed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Error processing payment callback",
    });
  }
};

export default callback;
