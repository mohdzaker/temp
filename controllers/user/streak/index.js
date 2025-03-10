import Streak from "../../../models/Streak.js";
import User from "../../../models/User.js";
import Transaction from "../../../models/Transaction.js";

const checkIn = async (req, res) => {
  try {
    const user_id = req.user.id;

    const streak = await Streak.findOne({ where: { user_id } });

    if (!streak) {
      await Streak.create({ user_id, streakCount: 1, lastCheckIn: new Date() });
      return res.status(200).json({
        status: "success",
        message: "Check-in successful!",
        streakCount: 1,
      });
    }

    const lastCheckIn = new Date(streak.lastCheckIn);
    const today = new Date();

    const diffInDays = Math.floor((today - lastCheckIn) / (1000 * 3600 * 24));

    if (diffInDays === 1) {
      streak.streakCount += 1;
      streak.lastCheckIn = today;
    } else if (diffInDays > 1) {
      streak.streakCount = 1;
      streak.lastCheckIn = today;
      streak.claimedReward = false;
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Already checked in today!",
      });
    }

    await streak.save();
    res.status(200).json({
      status: "success",
      message: "Check-in successful!",
      streakCount: streak.streakCount,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      message: "Error checking in",
    });
  }
};

const claimReward = async (req, res) => {
  try {
    const user_id = req.user.id;

    const streak = await Streak.findOne({ where: { user_id } });

    if (!streak) {
      return res.status(404).json({
        status: "failed",
        message: "No streak found!",
      });
    }

    if (streak.streakCount < 30) {
      return res.status(400).json({
        status: "failed",
        message: "Streak must be 30 to claim reward!",
      });
    }

    if (streak.claimedReward) {
      return res.status(400).json({
        status: "failed",
        message: "Reward already claimed!",
      });
    }

    const rewardAmount = Math.floor(Math.random() * (30 - 20) + 20);

    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found!",
      });
    }

    user.balance = parseFloat(user.balance) + rewardAmount;
    await user.save();

    streak.claimedReward = true;
    await streak.save();

    await Transaction.create({
      user_id,
      amount: rewardAmount,
      description: "Claimed reward for 30-day streak",
    });

    res.status(200).json({
      status: "success",
      message: "Reward claimed successfully!",
      rewardAmount,
      newBalance: user.balance,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      message: "Error claiming reward",
    });
  }
};

const getUserStreak = async (req, res) => {
  try {
    const user_id = req.user.id;

    const streak = await Streak.findOne({ where: { user_id } });

    if (!streak) {
      return res.status(404).json({
        status: "failed",
        message: "No streak found!",
      });
    }

    res.status(200).json({
      status: "success",
      streakCount: streak.streakCount,
      lastCheckIn: streak.lastCheckIn,
      claimedReward: streak.claimedReward,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      message: "Error retrieving streak",
    });
  }
};

export { checkIn, claimReward, getUserStreak };
