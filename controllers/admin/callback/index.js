import Withdraw from "../../../models/Withdraw.js";
import SecretKey from "../../../models/SecureKey.js";

const callback = async (req, res) => {
  try {
    const { data, secret_key } = req.body;
    
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

    if (!data || !data.upi || !data.tnx_id || !data.order_id || !data.status) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (data.status == "success") {
      const withdraw = await Withdraw.findOneAndUpdate(
        {
          order_id: data.order_id,
        },
        {
          $set: {
            withdraw_status: 0,
            status: data.status,
          },
        },
        { new: true }
      );
    } else {
      const withdraw = await Withdraw.findOneAndUpdate(
        {
          order_id: data.order_id,
        },
        {
          $set: {
            withdraw_status: 1,
            status: data.status,
          },
        },
        { new: true }
      );
    }

    return res.json({
      status: "success",
      message: "Payment callback processed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error processing payment callback",
    });
  }
};

export default callback;