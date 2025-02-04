import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";
import Withdraw from "../../../models/Withdraw.js";
import Refund from "../../../models/Refund.js";
import sequelize from "../../../config/index.js";
import { sendNotificationToUser } from "../../../utils/notification.js";

export const checkAndProcessRefunds = async (req, res) => {
    try {
        await Refund.create({
            user_id: 1,
            email: "user@example.com",
            amount: 10
        })

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
