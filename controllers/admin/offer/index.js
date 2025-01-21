import Offer from "../../../models/Offer.js";

export const addOffer = async (req, res) => {
  try {
    const {
      campaign_name,
      short_description,
      tracking_link,
      campaign_logo,
      status,
    } = req.body;

    if (!campaign_name) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Campaign name is required",
      });
    }

    if (!short_description) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Short description is required",
      });
    }

    if (!tracking_link) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Tracking link is required",
      });
    }

    if (!campaign_logo) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Campaign logo is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Status is required",
      });
    }

    const offer = new Offer({
      campaign_name,
      short_description,
      tracking_link,
      campaign_logo,
      status,
    });

    await offer.save();

    res.status(201).json({
      status: "success",
      success: true,
      message: "Offer added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Failed to add offer",
    });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const offers = await Offer.findAll({
      offset,
      limit: limitNum,
      order: [["createdAt", "DESC"]],
    });

    const totalOffers = await Offer.count();

    res.status(200).json({
      status: "success",
      success: true,
      totalPages: Math.ceil(totalOffers / limitNum),
      currentPage: pageNum,
      totalOffers,
      data: {
        offers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Failed to fetch offers",
    });
  }
};

export const editOffer = async (req, res) => {
  try {
    const {
      id,
      campaign_name,
      short_description,
      tracking_link,
      campaign_logo,
      status,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Offer ID is required",
      });
    }

    if (!campaign_name) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Campaign name is required",
      });
    }

    if (!short_description) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Short description is required",
      });
    }

    if (!tracking_link) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Tracking link is required",
      });
    }

    if (!campaign_logo) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Campaign logo is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Status is required",
      });
    }

    const checkOfferExists = await Offer.findOne({
      where: {
        id,
      },
    });

    if (!checkOfferExists) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Offer not found",
      });
    }

    await Offer.update(
      {
        campaign_name,
        short_description,
        tracking_link,
        campaign_logo,
        status,
      },
      { where: { id } }
    );

    res.status(200).json({
      status: "success",
      success: true,
      message: "Offer edited successfully",
      data: offer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Failed to edit offer",
    });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        success: false,
        message: "Offer ID is required",
      });
    }

    const offer = await Offer.findOne({ where: { id } });

    if (!offer) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Offer not found",
      });
    }

    await Offer.destroy({ where: { id } });

    res.status(200).json({
      status: "success",
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Failed to delete offer",
    });
  }
};
