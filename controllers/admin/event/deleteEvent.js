import Event from "../../../models/Event.js";

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({
        status: "failed",
        success: false,
        message: "Please provide an event ID!",
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

    await event.destroy();

    return res.json({
      status: "success",
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "failed",
      success: false,
      message: "An error occurred while deleting the event!",
    });
  }
};

export default deleteEvent;
