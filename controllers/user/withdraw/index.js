import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import { generateOrderId, sendPayout } from "../../../utils/sendPayout.js";

const withdraw = async (req, res) => {
  try {
    const { upi_id, amount } = req.body;

    // Validate input
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

    const user = req.user.id;

    const checkUserBalance = await User.findOne({
      where: { id: user },
    });

    if (!checkUserBalance) {
      return res.json({
        status: "failed",
        message: "User not found!",
      });
    }

    if (checkUserBalance.balance < amount) {
      return res.json({
        status: "failed",
        message: "Insufficient balance in the wallet!",
      });
    }

    const newBalance = checkUserBalance.balance - amount;

    await User.update(
      { balance: newBalance },
      { where: { id: user } }
    );
    const order_id = generateOrderId();
    if(amount < 100){
      const sendPayoutToUser = await sendPayout(checkUserBalance.username, upi_id, amount, order_id);
      if(sendPayoutToUser.status === "failed"){
        await Withdraw.create({
          user_id: user,
          upi_id,
          amount,
          time: new Date(),
        })
      }else{
        await Withdraw.create({
          user_id: user,
          upi_id,
          amount,
          time: new Date(),
          status: "processing",
        })
      }
    }
    const newWithdraw = await Withdraw.create({
      user_id: user,
      upi_id,
      amount,
      time: new Date(),
    });
    await Transaction.create({
      user_id: user,
      amount,
      description: `Withdrawal of ${amount} to UPI ${upi_id}`,
    })
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
