import Offer from "../../../models/Offer.js";
import Click from "../../../models/Click.js";
import Event from "../../../models/Event.js";
import { Sequelize } from "sequelize";
import EventHistory from "../../../models/EventHistory.js";
Offer.associate({ Click });
Click.associate({ Offer });
EventHistory.associate({ Offer, Click });
const getOffers = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 10 } = req.query; 

        const offset = (page - 1) * limit;

        const offers = await Offer.findAll({
            attributes: ["id", "campaign_name", "short_description", "tracking_link", "campaign_logo", "status"],
            where: {
                status: "active", 
            },
            include: [
                {
                    model: Click,
                    as: "clicks",
                    required: false, 
                    where: {
                        user_id,
                        status: { [Sequelize.Op.ne]: "completed" }, 
                    },
                },
                {
                    model: Event,
                    as: "events",
                    required: false,
                    where: {
                        status: "active"
                    },
                    attributes: ["id", "event_title", "event_short_desc", "event_amount", "status"]
                }
            ],
            offset,
            limit: parseInt(limit),
        });

        // Filter out offers where all associated events are completed
        const filteredOffers = offers.filter(offer => {
            const allEventsCompleted = offer.events.every(event => event.status === "completed");
            return !allEventsCompleted;
        });

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