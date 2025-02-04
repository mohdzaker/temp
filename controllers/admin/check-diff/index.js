import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";

export const getDiff = async (req, res) => {
    try {
        const { user_id } = req.body;
        const userRecord = await User.findOne({ where: { id: user_id } });
        const totalCreditAmount = await Transaction.sum('amount', { 
            where: {
              user_id: user_id,
              trans_type: "credit",
            },
          });
          const totalWithdrawAmount = await Withdraw.sum('amount', { 
            where: {
              user_id: user_id,
            },
          });
          const diff = totalCreditAmount - userRecord.balance;

          return res.json({
            status: "success",
            data: {
                actual_balance: userRecord.balance,
                total_credit_amount: totalCreditAmount,
                totalWithdrawAmount,
                total_diff: diff - totalWithdrawAmount
            },
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while fetching the difference",
        });
    }
}