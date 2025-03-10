import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Config from "../../../models/Config.js";
import { generateOrderId, initiatePayout } from "../../../utils/initiatePayout.js";
import { Op } from "sequelize";

const withdraw = async (req, res) => {
  try {
    const user = req.user.id;
    const { upi_id, amount, comment = "HuntCash" } = req.body;

    if (!upi_id || upi_id.trim() === "") {
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

    const siteConfig = await Config.findOne({ where: { id: 1 } });

    if (!userRecord.isPromoUser && amount < siteConfig.minimum_withdraw) {
      return res.json({
        status: "failed",
        message: `Minimum withdrawal amount should be ${siteConfig.minimum_withdraw}`,
      });
    }

    if (userRecord.balance < amount) {
      return res.json({
        status: "failed",
        message: "Insufficient balance in the wallet!",
      });
    }

    // const totalCreditAmount = await Transaction.sum("amount", {
    //   where: {
    //     user_id: user,
    //     trans_type: "credit",
    //   },
    // });

    // const totalDebitditAmount = await Transaction.sum("amount", {
    //   where: {
    //     user_id: user,
    //     trans_type: "debit",
    //   },
    // });

    // const totalamo = amount + totalDebitditAmount;
    // if (totalamo > totalCreditAmount) {
    //   return res.json({
    //     status: "failed",
    //     message: "You have exceeded your credited amount.",
    //   });
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const lastWithdraw = await Withdraw.findOne({
      where: {
        user_id: user,
        createdAt: { [Op.gte]: today },
      },
      order: [["createdAt", "DESC"]],
    });

    if (lastWithdraw) {
      return res.json({
        status: "failed",
        message: "You can only withdraw once per day.",
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
    }

    const txn_id = payoutResponse.tnx_id || "";
    const txn_status = payoutResponse.tnx_status === "success" ? "processing" : "pending";

    const newWithdraw = await Withdraw.create({
      user_id: user,
      upi_id,
      tnx_id: txn_id,
      order_id,
      amount,
      time: new Date(),
      withdraw_status: txn_status === "pending" ? 2 : 3,
      status: txn_status,
    });

    await Transaction.create({
      user_id: user,
      amount,
      description: `Withdrawal of ${amount} to UPI ${upi_id}`,
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
