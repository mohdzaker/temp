import axios from "axios";
import TgJoin from "../../../models/TgJoin.js";
import Click from "../../../models/Click.js";
import SecretKey from "../../../models/SecureKey.js";

const JoinTgAddReward = async (req, res) => {
  try {
    const { click_id, tg_user_id } = req.body;

    const checkCickExists = await Click.findOne({ where: { clickHash: click_id } });

    if (!checkCickExists) {
      return res.status(404).json({
        status: "failed",
        message: "Click not found",
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


    await TgJoin.create({ click_id, tg_user_id, isJoined: true });

    const keys = await SecretKey.findOne({where: {
      id: 1
    }});

    const res = await axios.get(`https://api.huntcash.in/api/user/postback/?click_id=${click_id}&event=jointg&secret_key=${keys.secret_key}`);
    console.log(res)
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
