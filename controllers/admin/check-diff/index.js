import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Refund from "../../../models/Refund.js";
import sequelize from "../../../config/index.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

const processRefund = async (amount, user) => {
    await sequelize.transaction(async (t) => {
        // Update user's balance
        user.balance += amount;
        await user.save({ transaction: t });

        // Update or create a refund record
        await Refund.upsert(
            { user_id: user.id, email: user.email, amount },
            { transaction: t }
        );

        // Create a transaction row
        await Transaction.create({
            user_id: user.id,
            amount,
            description: "Additional refund issued due to balance adjustment.",
            trans_type: "credit"
        }, { transaction: t });

        // Send notification
        try {
            await sendNotificationToUser(
                "Additional Refund Issued!",
                "Tap to view your updated balance!",
                user
            );
        } catch (notifError) {
            console.error("Notification error:", notifError.message);
        }
    });
};

export const checkAndProcessRefunds = async (req, res) => {
    try {
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

            // Check if user exists in Refund table
            const refundRecord = await Refund.findOne({ where: { user_id: user.id } });

            if (refundRecord) {
                // Calculate newAmo
                const newAmo = refundRecord.amount - finalDiff;

                // If newAmo > 1, process the refund
                if (newAmo > 1) {
                    await processRefund(newAmo, user);
                }
            } else {
                // If no refund exists, process normal refund logic
                if (finalDiff > 0) {
                    await processRefund(finalDiff, user);
                }
            }
        }

        return res.json({
            status: "success",
            message: "Refunds processed, transactions updated, and notifications sent.",
        });

    } catch (error) {
        console.error("Refund processing error:", error.message);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while processing refunds",
        });
    }
};
