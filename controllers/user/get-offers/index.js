import models from "../../../models/index.js";
const { Offer, Click, Event, EventHistory } = models;

const getOffers = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Step 1: Get all offers
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

    // Step 2: Filter offers based on event completion status and add events to offer data
    const filteredOffers = [];

    for (const offer of offers) {
      // Step 2.1: Get all events for the offer
      const events = await Event.findAll({
        where: {
          campaign_id: offer.id,
          status: "active",
        },
        attributes: ["id", "event_title", "event_short_desc", "event_amount"],
      });

      // Step 2.2: Check if the user has completed any events of this offer
      const completedEvents = await EventHistory.findAll({
        where: {
          user_id,
          campaign_id: offer.id,
          status: "completed",
        },
        include: [
          {
            model: Event,
            as: "event",
            where: {
              id: events.map((event) => event.id), // Match only the offer's events
            },
            required: true,
          },
        ],
      });

      // Step 3: Add offer to the filtered list if not all events are completed
      if (completedEvents.length !== events.length) {
        filteredOffers.push({
          ...offer.toJSON(),
          events, // Include all events for this offer in the response
        });
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
