import Referlist from "../../../models/Referlist.js";
import User from "../../../models/User.js";

const getReferHistory = async (req, res) => {
  try {
    const {user_id} = req.body; // Logged-in user's ID

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit; // Calculate offset for pagination

    // Count total referrals for the user
    const totalReferrals = await Referlist.count({
      where: { user_id },
    });

    if (totalReferrals === 0) {
      return res.json({
        status: "success",
        message: "No referrals found.",
        data: [],
        totalCommission: 0, // Add totalCommission in case of no referrals
      });
    }

    // Calculate total commission earned
    const totalCommission = await Referlist.sum("refer_commission", {
      where: { user_id },
    });

    // Fetch referrals with pagination
    const referrals = await Referlist.findAll({
      where: { user_id },
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: User,
          as: "ReferredUser", // Ensure you set up the alias in the association
          attributes: ["id", "username", "email", "mobileNumber", "profilePic"],
        },
      ],
    });

    const totalPages = Math.ceil(totalReferrals / limit);

    return res.json({
      status: "success",
      data: referrals,
      totalCommission, // Include total commission in the response
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalReferrals,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "failed",
      message: "Something went wrong!",
    });
  }
};

export default getReferHistory;
