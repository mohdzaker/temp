import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Config from "../../../models/Config.js";
import { generateOrderId, initiatePayout } from "../../../utils/initiatePayout.js";
import { Op } from "sequelize";
import axios from "axios";

const withdraw = async (req, res) => {
  try {
    const userId = req.user.id;
    const { upi_id, amount, type, comment = "HuntCash" } = req.body;

    if (!["upi", "google_play"].includes(type)) {
      return res.json({ status: "failed", message: "Invalid type, use 'upi' or 'google_play'." });
    }
    if (type === "upi" && !upi_id) {
      return res.json({ status: "failed", message: "Please enter a valid UPI ID!" });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.json({ status: "failed", message: "Please enter a valid amount!" });
    }

    const userRecord = await User.findOne({ where: { id: userId } });
    if (!userRecord) {
      return res.json({ status: "failed", message: "User not found!" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWithdraw = await Withdraw.findOne({
      where: { user_id: userId, createdAt: { [Op.gte]: today } },
      order: [["createdAt", "DESC"]],
    });
    if (lastWithdraw) {
      return res.json({ status: "failed", message: "You can only withdraw once per day." });
    }

    const siteConfig = type === "upi" ? await Config.findOne({ where: { id: 1 } }) : null;
    if (userRecord.balance < amount) {
      return res.json({ status: "failed", message: "Insufficient balance in the wallet!" });
    }
    if (type === "google_play" && amount < 10) {
      return res.json({ status: "failed", message: "Minimum amount for Google Play code is ₹10!" });
    }
    if (type === "upi" && amount < siteConfig?.minimum_withdraw) {
      return res.json({ status: "failed", message: `Minimum withdrawal amount is ₹${siteConfig.minimum_withdraw}` });
    }

    await User.update({ balance: userRecord.balance - amount }, { where: { id: userId } });
    const orderId = generateOrderId();
    let txnId = "0", txnStatus = "pending", withdrawStatus = 2, redeemCode = "";

    if (type === "upi" && amount <= 100) {
      const payoutResponse = await initiatePayout(userRecord.username, upi_id, amount, comment, orderId);
      txnId = payoutResponse.tnx_id || "0";
      txnStatus = payoutResponse.tnx_status ? "processing" : "pending";
      withdrawStatus = txnStatus === "pending" ? 2 : 3;
    } else if (type === "google_play") {
      const opcode = amount <= 29 ? "GPCS" : "GPC";
      const response = await axios.get(`https://www.connect.inspay.in/v3/recharge/api?username=IP8529740144&token=198fb67a0e1fbadef4fd9ad7580b95db&opcode=${opcode}&number=${userId}&amount=${amount}&orderid=${orderId}&format=json`);
      console.log(response)
      if (response.data.status === "success") {
        txnStatus = "success";
        withdrawStatus = 3;
        redeemCode = response.data.opid;
      } else {
        txnStatus = "processing";
        withdrawStatus = 2;
      }
      txnId = `GPAY-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const newWithdraw = await Withdraw.create({
      user_id: userId,
      type,
      upi_id,
      tnx_id: txnId,
      order_id: orderId,
      amount,
      redeem_code: redeemCode,
      time: new Date(),
      withdraw_status: withdrawStatus,
      status: txnStatus,
    });

    await Transaction.create({
      user_id: userId,
      amount,
      description: type === "google_play" ? `Google Play withdrawal of ₹${amount}` : `Withdrawal of ₹${amount} to ${type.toUpperCase()} ${upi_id}`,
      trans_type: "debit",
    });

    return res.json({
      status: "success",
      message: "Withdrawal request created successfully!",
      data: newWithdraw,
      ...(type === "google_play" && { redeem_code: redeemCode })
    });
  } catch (error) {
    console.error("Error in withdrawal process:", error);
    return res.json({ status: "failed", message: "Something went wrong! Please try again." });
  }
};

export default withdraw;
