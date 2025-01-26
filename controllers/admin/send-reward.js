import User from "../../models/User.js";
import Transaction from "../../models/Transaction.js";

const sendReward = async (req, res) => {
  try {
    const { user_id, amount, description } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failed",
        message: "User ID is required",
      });
    }

    if (!amount) {
      return res.status(400).json({
        status: "failed",
        message: "Amount is required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0",
      });
    }

    if (!description) {
      return res.status(400).json({
        status: "failed",
        message: "Description is required",
      });
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    user.balance += amount;
    await user.save();

    await Transaction.create({
      user_id,
      amount,
      description,
    });

    return res.json({
      status: "success",
      message: "Reward sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

export default sendReward;