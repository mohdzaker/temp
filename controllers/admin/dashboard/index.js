import User from "../../../models/User.js";
import Offer from "../../../models/Offer.js";
import Withdraw from "../../../models/Withdraw.js";

const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBannedUsers = await User.count({
      where: { isBanned: true },
    });

    const totalOffers = await Offer.count();
    const totalDisabledOffers = await Offer.count({
      status: "inactive",
    });

    const totalWithdraw = await Withdraw.count();
    const totalWithdrawAmout = await Withdraw.sum("amount");
    const totalSuccessWithdraw = await Withdraw.count({
      where: {
        status: "success",
      },
    });
    const totalSuccessWithdrawAmout = await Withdraw.sum("amount", {
      where: {
        status: "approved",
      },
    });

    res.status(200).json({
      status: "success",
      message: "Dashboard data fetched successfully.",
      data: {
        totalUsers,
        totalBannedUsers,
        totalOffers,
        totalDisabledOffers,
        totalWithdraw,
        totalWithdrawAmout,
        totalSuccessWithdraw,
        totalSuccessWithdrawAmout,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
