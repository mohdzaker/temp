import Transaction from "../../../models/Transaction.js";
import User from "../../../models/User.js";

const claimSignupBonus = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await User.findOne({
      where: {
        id: user_id,
      },
    });

    if (user.hasReceivedBonus === true) {
      return res.status(404).json({
        status: "failed",
        message: "User already received signup bonus!",
      });
    }
    user.hasReceivedBonus = true;
    user.balance += 2;
    await user.save();
    await Transaction.create({
      user_id: user_id,
      amount: 2,
      description: "Signup bonus",
      trans_type: "credit",
    });
    return res.status(200).json({
      status: "success",
      message: "Signup bonus successfully claimed!",
      new_balance: user.balance,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while claiming the signup bonus",
    });
  }
};

export default claimSignupBonus;
