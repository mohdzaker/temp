import User from "../../../models/User.js";

const getReferHistory = async (req, res) => {
  try {
    const user_id = req.user.id; 

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit; 

    const totalReferrals = await User.count({
      where: {
        referedBy: user_id,
      },
    });

    if (totalReferrals === 0) {
      return res.json({
        status: "success",
        message: "No referrals found.",
        data: [],
      });
    }

    const referrals = await User.findAll({
      where: {
        referedBy: user_id,
      },
      offset,
      limit: parseInt(limit),
      attributes: ["id", "username", "email", "mobileNumber", "profilePic"],
    });

    const totalPages = Math.ceil(totalReferrals / limit);

    return res.json({
      status: "success",
      data: referrals,
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
