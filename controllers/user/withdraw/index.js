import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Config from "../../../models/Config.js";
import {
  generateOrderId,
  initiatePayout,
} from "../../../utils/initiatePayout.js";

const withdraw = async (req, res) => {
  try {
    const user = req.user.id;
    const { upi_id, amount, comment = "HuntCash" } = req.body;

    if (!upi_id || upi_id === "") {
      return res.json({
        status: "failed",
        message: "Please enter a valid UPI ID!",
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.json({
        status: "failed",
        message: "Please enter a valid amount!",
      });
    }

    const userRecord = await User.findOne({ where: { id: user } });
    if (!userRecord) {
      return res.json({
        status: "failed",
        message: "User not found!",
      });
    }
    const siteConfig = await Config.findOne({
      where: {
        id: 1
      }
    })
    if(amount < siteConfig.minimum_withdraw){
      return res.json({
        status: "failed",
        message: `Minimum withdrawal amount should be ${siteConfig.minimum_withdraw}`
      });
    }
    if (userRecord.balance < amount) {
      return res.json({
        status: "failed",
        message: "Insufficient balance in the wallet!",
      });
    }

    const newBalance = userRecord.balance - amount;
    await User.update({ balance: newBalance }, { where: { id: user } });

    const order_id = generateOrderId();
    let payoutResponse = { tnx_id: "", tnx_status: "pending", message: "" };
    if (amount <= 100) {

    payoutResponse = await initiatePayout(
        userRecord.username,
        upi_id,
        amount,
        comment,
        order_id
      );

      if(payoutResponse.status !== 'success'){
        return res.json({
          status: "failed",
          message: payoutResponse.message,
        });
      }
    }

    const txn_id = payoutResponse.tnx_id? payoutResponse.tnx_id : "";
    const txn_status =
      payoutResponse.tnx_status == "success" ? "processing" : "pending" || "pending";

    const newWithdraw = await Withdraw.create({
      user_id: user,
      upi_id,
      tnx_id: txn_id,
      order_id,
      amount,
      time: new Date(),
      withdraw_status: txn_status == "success" ? 2 : 3,
      status: txn_status === "pending" ? "processing" : "pending",
    });

    await Transaction.create({
      user_id: user,
      amount,
      description: `Withdrawal of ${amount} to UPI ${upi_id}`,
      trans_type: "debit",
    });

    return res.json({
      status: "success",
      message:
        "Withdrawal request created successfully! " + payoutResponse.message,
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
