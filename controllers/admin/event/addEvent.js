import Event from "../../../models/Event.js";

const addEvent = async (req, res) => {
  try {
    const {
      campaign_id,
      event_id,
      event_title,
      event_short_desc,
      event_amount,
      status,
    } = req.body;

    if (!campaign_id || campaign_id == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Campaign ID!",
      });
    }

    if (!event_id || event_id == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Event ID!",
      });
    }

    if (!event_title || event_title == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Event Title!",
      });
    }

    if (!event_short_desc || event_short_desc == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Event Short Description!",
      });
    }

    if (!event_amount || event_amount == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Event Amount!",
      });
    }

    if (!status || status == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an Status!",
      });
    }

    const newEvent = await Event.create({
      campaign_id,
      event_id,
      event_title,
      event_short_desc,
      event_amount,
      status,
    });

    return res.json({
      status: "success",
      success: true,
      message: "Event added successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "failed",
      success: false,
      message: "An error occurred while adding the event!",
    });
  }
};

export default addEvent;
