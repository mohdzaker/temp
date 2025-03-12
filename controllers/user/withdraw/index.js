import Withdraw from "../../../models/Withdraw.js";
import { Op } from "sequelize";

const getWithdrawHistory = async (req, res) => {
    try {
        const user_id = req.user.id; 
        const { page = 1, limit = 10, status } = req.query; 

        const offset = (page - 1) * limit;

        // Define filters
        const filters = { user_id };
        if (status && ["pending", "processing", "failed"].includes(status)) {
            filters.status = status;
        }

        // Fetch withdrawals with filters and pagination
        const { rows, count } = await Withdraw.findAndCountAll({
            where: filters,
            order: [["time", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            status: "success",
            data: rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalRecords: count,
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "failed",
            message: "Failed to get withdrawal history",
        });
    }
};

export default getWithdrawHistory;
