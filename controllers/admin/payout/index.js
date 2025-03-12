import Withdraw from "../../../models/Withdraw.js";

const getPendingWithdraw = async (req, res) => {
    try {
        const { page = 1, limit = 10, status="pending" } = req.query;

        const offset = (page - 1) * limit;

        const pendingWithdrawals = await Withdraw.findAndCountAll({
            where: {
                status
            },
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
            message: "Failed to get pending withdrawals"
        });
    }
};

export default getPendingWithdraw;
