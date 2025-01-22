import Withdraw from "../../../models/Withdraw.js";

const getWithdrawHistory = async (req, res) => {
    try {
        const user_id = req.user.id; 
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { rows, count } = await Withdraw.findAndCountAll({
            where: { user_id },
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
