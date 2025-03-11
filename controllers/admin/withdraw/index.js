import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import { initiatePayout } from "../../../utils/initiatePayout.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

export const approveWithdraw = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;

    if (!user_id && !order_id) {
      return res.status(400).json({
        status: "failed",
        message: "User ID and Order ID are required",
      });
    }

    const checkWithdraw = await Withdraw.findOne({
      where: { user_id, order_id, status: "pending" },
    });

    if (!checkWithdraw) {
      return res.status(404).json({
        status: "failed",
        message: "Withdrawal not found or already approved",
      });
    }

    checkWithdraw.status = "approved";
    await checkWithdraw.save();

    res.json({
      status: "success",
      message: "Withdrawal approved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error approving withdrawal",
    });
  }
};

export const rejectWithdraw = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;
    if (!user_id || !order_id) {
      return res.status(400).json({
        status: "failed",
        message: "User ID and Order ID are required",
      });
    }
    const checkWithdraw = await Withdraw.findOne({
      where: { user_id, order_id },
    });
    if (!checkWithdraw) {
      return res.status(404).json({
        status: "failed",
        message: "Withdrawal not found or already rejected",
      });
    }
    checkWithdraw.status = "rejected";
    await checkWithdraw.save();
    const user = await User.findOne({
      where: { id: user_id },
    });

    user.balance += checkWithdraw.amount;
    await user.save();
    await Transaction.create({
      user_id,
      amount: checkWithdraw.amount,
      description: "Withdraw Rejected!",
      trans_type: "credit",
    });
    await sendNotificationToUser(
      "Withdraw rejected!",
      "Your withdraw was rejected!",
      user_id
    );
    res.json({
      status: "success",
      message: "Withdrawal rejected successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error rejecting withdrawal",
    });
  }
};

export const payToUser = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;

    if (!user_id || !order_id) {
      return res.status(400).json({
        status: "failed",
        message: "User ID and Order ID are required",
      });
    }

    const checkWithdraw = await Withdraw.findOne({
      where: { user_id, order_id },
    });

    if (!checkWithdraw) {
      return res.status(404).json({
        status: "failed",
        message: "Withdrawal not found or already paid",
      });
    }

    const user = await User.findOne({
      where: { id: user_id },
    });

    const pay = await initiatePayout(
      user.username,
      checkWithdraw.upi_id,
      checkWithdraw.amount,
      "HuntCash",
      checkWithdraw.order_id
    );

    if (pay.status == "success") {
      await sendNotificationToUser(
        "Withdraw successfull!",
        "Your withdraw was successfull!",
        user.id
      );
      checkWithdraw.withdraw_status = 0;
      checkWithdraw.status = "processing";
      await checkWithdraw.save();
      res.json({
        status: "success",
        message: "Withdrawal paid successfully",
      });
    } else {
      checkWithdraw.withdraw_status = 1;
      await checkWithdraw.save();
      res.json({
        status: "failed",
        message: "Failed to pay withdrawal",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error paying to user",
    });
  }
};
