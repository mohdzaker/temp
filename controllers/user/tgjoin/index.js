import TgJoin from "../../../models/TgJoin.js";
import User from "../../../models/User.js";

const JoinTgAddReward = async (req, res) => {
  try {
    const { user_id, tg_user_id } = req.body;

    const checkUserExists = await User.findOne({ where: { id: user_id } });

    if (!checkUserExists) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const user = await TgJoin.findOne({ where: { user_id } });

    if (user) {
      return res.status(200).json({
        status: "failed",
        code: 1,
        message: "User already joined Telegram group",
      });
    }

    const checkTgIdExists = await TgJoin.findOne({
      where: {
        tg_user_id,
        isJoined: true,
      },
    });

    if (checkTgIdExists) {
      return res.status(200).json({
        status: "failed",
        code: 2,
        message: "Telegram user already joined",
      });
    }

    await TgJoin.create({ user_id, tg_user_id, isJoined: true });

    const userData = await User.findOne({ where: { id: user_id } });

    if (!userData) {
      return res.status(404).json({
        status: "failed",
        message: "User not found!",
      });
    }

    userData.balance = parseFloat(userData.balance) + 2;
    await userData.save();

    res.status(200).json({
      status: "success",
      message: "User joined Telegram group successfully!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      message: "Error checking user joined",
    });
  }
};

export default JoinTgAddReward;
