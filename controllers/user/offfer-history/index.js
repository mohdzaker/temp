import { Click, EventHistory } from "../../../models/index.js";

const getOfferHistory = async (req, res) => {
  try {
    const user_id = req.user.id; // Logged-in user's ID
    const { page = 1, limit = 10 } = req.query; 

    const offset = (page - 1) * limit;

    // Fetch data with associations
    const { rows, count } = await Click.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: EventHistory,
          as: "eventHistory", // Alias defined in the association
          where: { user_id }, 
          required: false, // Optional join
        },
      ],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      status: "success",
      data: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalRecords: count,
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: "failed",
      message: "Failed to get offer history",
    });
  }
};

export default getOfferHistory;
