import EventHistory from "../../../models/EventHistory.js"
import Offer from "../../../models/Offer.js";
import Click from "../../../models/Click.js"

const getOfferHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query; 

    const offset = (page - 1) * limit;

    const { rows, count } = await Click.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: EventHistory,
          as: "eventHistory",
          required: false,
        },
        {
          model: Offer,
          as: "campaign",
          attributes: [
            'id', 
            'campaign_name', 
            'short_description', 
            'tracking_link', 
            'campaign_logo', 
            'status'
          ]
        }
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
    res.status(500).json({
      status: "failed",
      message: "Failed to get offer history",
    });
  }
};

export default getOfferHistory;