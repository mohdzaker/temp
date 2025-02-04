import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Refund from "../../../models/Refund.js";
import sequelize from "../../../config/index.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

export const checkAndProcessRefunds = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll();

        for (const user of users) {
            const totalCreditAmount = await Transaction.sum('amount', { 
                where: { user_id: user.id, trans_type: "credit" }
            }) || 0;

            const totalWithdrawAmount = await Withdraw.sum('amount', { 
                where: { user_id: user.id }
            }) || 0;

            const diff = totalCreditAmount - user.balance;
            const finalDiff = diff - totalWithdrawAmount;

            // If finalDiff is positive, update user's balance and save in Refund table
            if (finalDiff > 0) {
                await sequelize.transaction(async (t) => {
                    // Update user's balance
                    user.balance += finalDiff;
                    await user.save({ transaction: t });

                    // Save refund record
                    await Refund.create({
                        user_id: user.id,
                        email: user.email,
                        amount: finalDiff
                    }, { transaction: t });

                    // Send notification to user
                    await sendNotificationToUser(
                        "Refund Issued regarding your Withdrawal!",
                        "Tap to view new balance!",
                        user
                    );
                });
            }
        }

        return res.json({
            status: "success",
            message: "Balance differences checked, refunds processed, and notifications sent.",
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while processing refunds",
        });
    }
};
