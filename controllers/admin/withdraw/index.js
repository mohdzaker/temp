import Withdraw from "../../../models/Withdraw.js";

const approveWithdraw = async (req, res) => {
    try {
        const { user_id, order_id } = req.body;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: "Error approving withdrawal",
        });
    }
}