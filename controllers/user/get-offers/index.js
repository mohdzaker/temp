import Offer from "../../../models/Offer.js";
import Click from "../../../models/Click.js";
import Event from "../../../models/Event.js";
import EventHistory from "../../../models/EventHistory.js";

Offer.associate({ Click, Event }); // ✅ Include Event
Event.associate({ Offer, EventHistory });
EventHistory.associate({ Offer, Click, Event });
Click.associate({ Offer, EventHistory });


const getOffers = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Step 1: Get all offers
        const offers = await Offer.findAll({
            attributes: ["id", "campaign_name", "short_description", "tracking_link", "campaign_logo", "status"],
            where: {
                status: "active",
            },
            offset,
            limit: parseInt(limit),
        });

        // Step 2: Filter offers based on event completion status
        const filteredOffers = [];

        for (const offer of offers) {
            // Step 2.1: Get all events for the offer
            const events = await Event.findAll({
                where: {
                    campaign_id: offer.id,
                    status: "active",
                },
                attributes: ["id"],
            });

            // Step 2.2: Check if the user has completed all events of this offer
            const completedEvents = await EventHistory.findOne({
                where: {
                  user_id,
                  campaign_id: offer.id,
                  status: "completed",
                },
                include: [
                  {
                    model: Event,
                    as: "event", // ✅ Ensure this alias matches EventHistory.belongsTo(Event, { as: "event" })
                    where: {
                      id: events.map(event => event.id),
                    },
                    required: true,
                  },
                ],
              });
              
              // ✅ Fix: Check if completedEvents exists before accessing .length
              if (!completedEvents || !Array.isArray(completedEvents) || completedEvents.length !== events.length) {
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
