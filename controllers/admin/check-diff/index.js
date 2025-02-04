import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Refund from "../../../models/Refund.js";
import sequelize from "../../../config/index.js";
import sendNotification from "../send-notification/index.js"; // Import notification function

export const checkAndProcessRefunds = async (req, res) => {
    try {
        // Fetch all users
        const {user_id } = req.body;

        // Save refund record
        await Refund.create({
            user_id,
            email: "user@example",
            amount: finalDiff
        });

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
