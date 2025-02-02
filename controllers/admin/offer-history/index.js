import EventHistory from "../../../models/EventHistory.js";
import Event from "../../../models/Event.js"; // Import Event model
import Offer from "../../../models/Offer.js";
import Click from "../../../models/Click.js";

export const getOfferHistoryByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Extract user_id from params
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { rows, count } = await Click.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: EventHistory,
          as: "eventHistory",
          required: false,
          include: [
            {
              model: Event,
              as: "event",
              attributes: ["event_title", "event_short_desc"],
            },
          ],
        },
        {
          model: Offer,
          as: "campaign",
          attributes: [
            "id",
            "campaign_name",
            "short_description",
            "tracking_link",
            "campaign_logo",
            "status",
          ],
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
    res.status(500).json({
      status: "failed",
      message: "Failed to get offer history by user ID",
    });
  }
};

const getOfferHistory = async (req, res) => {
  try {
    const { user_id } = req.body;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { rows, count } = await Click.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: EventHistory,
          as: "eventHistory",
          required: false,
          include: [
            {
              model: Event,
              as: "event",
              attributes: ["event_title", "event_short_desc"],
            },
          ],
        },
        {
          model: Offer,
          as: "campaign",
          attributes: [
            "id",
            "campaign_name",
            "short_description",
            "tracking_link",
            "campaign_logo",
            "status",
          ],
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
    res.status(500).json({
      status: "failed",
      message: "Failed to get offer history",
    });
  }
};

export const getAllOfferHistory = async (req, res) => {
  try {
    const { campaign_id, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { rows, count } = await Click.findAndCountAll({
      where: campaign_id ? { campaign_id } : {},
      include: [
        {
          model: EventHistory,
          as: "eventHistories",
          required: false,
          include: [
            {
              model: Event,
              as: "event",
              attributes: ["event_title", "event_short_desc"],
            },
          ],
        },
        {
          model: Offer,
          as: "campaign",
          attributes: [
            "id",
            "campaign_name",
            "short_description",
            "tracking_link",
            "campaign_logo",
            "status",
          ],
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
    res.status(500).json({
      status: "failed",
      message: "Failed to get offer history",
    });
  }
};

export default getOfferHistory;
