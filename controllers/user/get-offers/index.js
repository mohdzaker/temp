import models from "../../../models/index.js";
const { Offer, Click, Event, EventHistory } = models;

const getOffers = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Step 1: Get all active offers
    const offers = await Offer.findAll({
      attributes: [
        "id",
        "campaign_name",
        "short_description",
        "tracking_link",
        "campaign_logo",
        "status",
      ],
      where: {
        status: "active",
      },
      offset,
      limit: parseInt(limit),
    });

    // Step 2: Filter offers where no completed event history exists for the user
    const filteredOffers = [];

    for (const offer of offers) {
      // Step 2.1: Check if there is any completed event history for the offer and user
      const completedEventHistory = await EventHistory.findOne({
        where: {
          user_id,
          campaign_id: offer.id,
          status: "completed",
        },
      });

      // If no completed event history exists, add offer to filtered list
      if (!completedEventHistory) {
        filteredOffers.push(offer);
      }
    }

    return res.status(200).json({
      status: "success",
      data: filteredOffers,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
        total: filteredOffers.length,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while fetching offers",
    });
  }
};

export default getOffers;
