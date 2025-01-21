import Transaction from "../../../models/Transaction.js";

const getTransactions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const transactions = await Transaction.findAndCountAll({
            where: { user_id }, 
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            status: "success",
            data: transactions.rows,
            total: transactions.count,
            page: parseInt(page),
            totalPages: Math.ceil(transactions.count / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Failed to fetch transactions",
        });
    }
};

export default getTransactions;
