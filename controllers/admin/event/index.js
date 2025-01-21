import Event from "../../../models/Event.js";
import Offer from "../../../models/Offer.js";

export const addEvent = async (req, res) => {
  try {
    const { campaign_id, event_title, event_short_desc, event_amount, status } =
      req.body;

    if (!campaign_id) {
      return res.status(400).json({
        status: "failed",
        message: "Campaign ID is required",
      });
    }

    if (!event_title) {
      return res.status(400).json({
        status: "failed",
        message: "Event Title is required",
      });
    }

    if (!event_short_desc) {
      return res.status(400).json({
        status: "failed",
        message: "Event Short Description is required",
      });
    }

    if (!event_amount) {
      return res.status(400).json({
        status: "failed",
        message: "Event Amount is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: "failed",
        message: "Status is required",
      });
    }

    const checkCampaignExist = await Offer.findOne({
      where: {
        id: campaign_id,
      },
    });

    if (!checkCampaignExist) {
      return res.status(404).json({
        status: "failed",
        message: "Campaign not found",
      });
    }

    const newEvent = await Event.create({
      campaign_id,
      event_title,
      event_short_desc,
      event_amount,
      status,
    });

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const editEvent = async (req, res) => {
  try {
    const {
      id,
      campaign_id,
      event_title,
      event_short_desc,
      event_amount,
      status,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Event ID is required",
      });
    }

    if (!campaign_id) {
      return res.status(400).json({
        status: "failed",
        message: "Campaign ID is required",
      });
    }

    if (!event_title) {
      return res.status(400).json({
        status: "failed",
        message: "Event Title is required",
      });
    }

    if (!event_short_desc) {
      return res.status(400).json({
        status: "failed",
        message: "Event Short Description is required",
      });
    }

    if (!event_amount) {
      return res.status(400).json({
        status: "failed",
        message: "Event Amount is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: "failed",
        message: "Status is required",
      });
    }

    const checkEventExist = await Event.findOne({
      where: {
        id,
      },
    });

    if (!checkEventExist) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
      });
    }

    const checkCampaignExist = await Offer.findOne({
      where: {
        id: campaign_id,
      },
    });

    if (!checkCampaignExist) {
      return res.status(404).json({
        status: "failed",
        message: "Campaign not found",
      });
    }

    await Event.update(
      {
        campaign_id,
        event_title,
        event_short_desc,
        event_amount,
        status,
      },
      { where: { id } }
    );

    res.status(200).json({
      status: "success",
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Event ID is required",
      });
    }

    const checkEventExist = await Event.findOne({
      where: {
        id,
      },
    });

    if (!checkEventExist) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
      });
    }

    await Event.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllOffersWithEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    // Fetch offers with associated events
    const offers = await Offer.findAll({
      offset,
      limit: limitNum,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Event, // Assuming Event is associated with Offer
          as: "events", // Alias defined in the association
          attributes: ["id", "event_amount"], // Fetch only necessary fields
        },
      ],
    });

    // Calculate total reward for each offer
    const offersWithTotalRewards = offers.map((offer) => {
      const totalReward = offer.events.reduce((sum, event) => sum + event.event_amount, 0);
      return {
        
        ...offer.toJSON(), // Convert Sequelize instance to plain object
        totalReward,
      };
    });

    // Get total count of offers
    const totalOffers = await Offer.count();

    res.status(200).json({
      status: "success",
      success: true,
      totalPages: Math.ceil(totalOffers / limitNum),
      currentPage: pageNum,
      totalOffers,
      data: {
        offers: offersWithTotalRewards,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getOfferByIdWithEvents = async (req, res) => {
  try {
    const { id } = req.body;

    const offer = await Offer.findOne({
      where: { id },
      include: [
        {
          model: Event,
          as: "events",
        },
      ],
    });

    if (!offer) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};
