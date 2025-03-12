import User from "../../../models/User.js";
import Offer from "../../../models/Offer.js";
import Withdraw from "../../../models/Withdraw.js";
import { Op } from "sequelize";

const getDateRange = (filter) => {
  const now = new Date();
  let startDate, endDate;

  switch (filter) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "yesterday":
      startDate = new Date(now.setDate(now.getDate() - 1));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "this_month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case "last_month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case "this_year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      return null;
  }

  return { startDate, endDate };
};

export const getDashboardData = async (req, res) => {
  try {
    const { filter } = req.query; // Accept filter from query params
    const dateRange = getDateRange(filter);
    const whereCondition = dateRange
      ? {
          createdAt: { [Op.between]: [dateRange.startDate, dateRange.endDate] },
        }
      : {};

    const totalUsers = await User.count({ where: whereCondition });
    const totalBannedUsers = await User.count({
      where: { isBanned: true, ...whereCondition },
    });

    const totalOffers = await Offer.count({ where: whereCondition });
    const totalDisabledOffers = await Offer.count({
      where: { status: "inactive", ...whereCondition },
    });

    const totalWithdraw = await Withdraw.count({ where: whereCondition });
    const totalWithdrawAmout = await Withdraw.sum("amount", {
      where: whereCondition,
    });
    const totalSuccessWithdraw = await Withdraw.count({
      where: { status: "success", ...whereCondition },
    });
    const totalSuccessWithdrawAmout = await Withdraw.sum("amount", {
      where: { status: "approved", ...whereCondition },
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
        totalWithdrawAmout: totalWithdrawAmout || 0,
        totalSuccessWithdraw,
        totalSuccessWithdrawAmout: totalSuccessWithdrawAmout || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
