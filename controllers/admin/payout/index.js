import Withdraw from "../../../models/Withdraw.js";
import { Op } from "sequelize";

const getPendingWithdraw = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const offset = (page - 1) * limit;

        const allowedStatuses = ["processing", "pending", "completed", "failed"];

        const whereCondition = status && allowedStatuses.includes(status) 
            ? { status } 
            : {};

        const pendingWithdrawals = await Withdraw.findAndCountAll({
            where: whereCondition,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['time', 'DESC']]
        });

        res.status(200).json({
            status: "success",
            data: pendingWithdrawals.rows,
            total: pendingWithdrawals.count,
            page: parseInt(page),
            totalPages: Math.ceil(pendingWithdrawals.count / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Failed to get withdrawals"
        });
    }
};

export default getPendingWithdraw;
