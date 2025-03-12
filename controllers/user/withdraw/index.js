import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Config from "../../../models/Config.js";
import {
  generateOrderId,
  initiatePayout,
} from "../../../utils/initiatePayout.js";
import { Op } from "sequelize";

const withdraw = async (req, res) => {
  try {
    const user = req.user.id;
    const { upi_id, amount, type, comment = "HuntCash" } = req.body;

    if (!["upi", "google_play"].includes(type))
      return res.json({
        status: "failed",
        message: "Invalid type, please enter either 'upi' or 'google_play'.",
      });
    if (type === "upi" && !upi_id) {
      return res.json({
        status: "failed",
        message: "Please enter a valid UPI ID!",
      });
    }
    if (!amount || isNaN(amount) || amount <= 0)
      return res.json({
        status: "failed",
        message: "Please enter a valid amount!",
      });
    const userRecord = await User.findOne({ where: { id: user } });
    if (!userRecord)
      return res.json({ status: "failed", message: "User not found!" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWithdraw = await Withdraw.findOne({
      where: { user_id: user, createdAt: { [Op.gte]: today } },
      order: [["createdAt", "DESC"]],
    });
    if (lastWithdraw)
      return res.json({
        status: "failed",
        message: "You can only withdraw once per day.",
      });

    const siteConfig =
      type === "upi" ? await Config.findOne({ where: { id: 1 } }) : null;

    if (userRecord.balance < amount)
      return res.json({
        status: "failed",
        message: "Insufficient balance in the wallet!",
      });

    if (type === "google_play" && amount < 10)
      return res.json({
        status: "failed",
        message: "Minimum amount for Google Play code is ₹10!",
      });
    if (type === "upi" && amount < siteConfig?.minimum_withdraw) {
      return res.json({
        status: "failed",
        message: `Minimum withdrawal amount should be ${siteConfig.minimum_withdraw}`,
      });
    }

    await User.update(
      { balance: userRecord.balance - amount },
      { where: { id: user } }
    );

    const order_id = generateOrderId();

    let txn_id = "0",
      txn_status = "pending",
      withdraw_status = 2;

    if (type === "upi" && amount <= 100) {
      const payoutResponse = await initiatePayout(
        userRecord.username,
        upi_id,
        amount,
        comment,
        order_id
      );
      txn_id = payoutResponse.tnx_id || "0";
      txn_status = payoutResponse.tnx_status ? "processing" : "pending";
      withdraw_status = txn_status === "pending" ? 2 : 3;
    } else if (type === "google_play") {
      // Dummy Google Play Transaction ID
      txn_id = `GPAY-${Math.floor(100000 + Math.random() * 900000)}`;
      txn_status = "processing"; // Simulating processing status
      withdraw_status = 3; // Mark as processing
    }
    const newWithdraw = await Withdraw.create({
      user_id: user,
      type,
      upi_id,
      tnx_id: txn_id,
      order_id,
      amount,
      time: new Date(),
      withdraw_status,
      status: txn_status,
    });

    await Transaction.create({
      user_id: user,
      amount,
      description:
        type === "google_play"
          ? `Google Play withdrawal of ₹${amount}`
          : `Withdrawal of ₹${amount} to ${type.toUpperCase()} ${upi_id}`,
      trans_type: "debit",
    });

    return res.json({
      status: "success",
      message: "Withdrawal request created successfully!",
      data: newWithdraw,
    });
  } catch (error) {
    console.error("Error in withdrawal process:", error);
    return res.json({
      status: "failed",
      message: "Something went wrong! Please try again.",
    });
  }
};

export default withdraw;
