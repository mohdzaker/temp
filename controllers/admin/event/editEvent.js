import Event from "../../../models/Event.js";

const editEvent = async (req, res) => {
  try {
    const {
      id,
      campaign_id,
      event_id,
      event_title,
      event_short_desc,
      event_amount,
      status,
    } = req.body;

    if (!id || id == "") {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an event ID!",
      });
    }

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

    const event = await Event.findByPk(id);

    if (!event) {
      return res.json({
        status: "failed",
        success: false,
        message: "Event not found!",
      });
    }

    const updatedEvent = await event.update({
      campaign_id: campaign_id || event.campaign_id,
      event_id: event_id || event.event_id,
      event_title: event_title || event.event_title,
      event_short_desc: event_short_desc || event.event_short_desc,
      event_amount: event_amount || event.event_amount,
      status: status !== undefined ? status : event.status,
    });

    return res.json({
      status: "success",
      success: true,
      message: "Event updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "failed",
      success: false,
      message: "An error occurred while updating the event!",
    });
  }
};

export default editEvent;
