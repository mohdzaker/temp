import { v4 as uuidv4 } from "uuid";
import Click from "../../../models/Click.js";
import Event from "../../../models/Event.js";
import Offer from "../../../models/Offer.js";
import EventHistory from "../../../models/EventHistory.js";
import useragent from "useragent";

const clickHandler = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { campaign_id, gaid } = req.body;

    if (!campaign_id) {
      return res.json({ status: "failed", message: "Campaign ID is required!" });
    }
    if (!gaid) {
      return res.json({ status: "failed", message: "Google Analytics ID is required!" });
    }

    const checkCampaignExists = await Offer.findOne({ where: { id: campaign_id } });
    if (!checkCampaignExists) {
      return res.json({ status: "failed", message: "Campaign not found!" });
    }
    if (checkCampaignExists.status === "inactive") {
      return res.json({ status: "failed", message: "Campaign is inactive!" });
    }

    // Fetch all events related to the offer (campaign_id)
    const events = await Event.findAll({ where: { campaign_id } });

    // Check if all related events are completed
    const completedEvents = await EventHistory.findAll({
      where: { user_id, campaign_id, status: "completed" },
      include: [{ model: Event, as: "event", where: { id: events.map(e => e.id) }, required: true }],
    });

    if (completedEvents.length === events.length) {
      return res.json({ status: "success", message: "Offer already completed!", offer_completed: true });
    }

    const ipAddress = req.ip || req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;
    const referer = req.get("referer") || "No referer";
    const userAgent = req.headers["user-agent"];
    const agent = useragent.parse(userAgent);
    const browserType = agent.family;
    const clickHash = uuidv4();

    await Click.create({
      clickHash, user_id, campaign_id, ip_address: ipAddress, referer, user_agent: userAgent, browser_type: browserType,
    });

    for (let event of events) {
      await EventHistory.create({ user_id, clickHash, campaign_id, event_id: event.id, status: "pending" });
    }

    let tracking_link = checkCampaignExists.tracking_link.replace("{click_id}", clickHash).replace("{gaid}", gaid);

    res.json({
      status: "success",
      message: "Click recorded successfully! Events history added with pending status.",
      tracking_link,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: "Internal server error!" });
  }
};

export default clickHandler;
