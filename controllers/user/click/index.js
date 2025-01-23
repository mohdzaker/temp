import { v4 as uuidv4 } from "uuid";
import Click from "../../../models/Click.js";
import Event from "../../../models/Event.js";
import Offer from "../../../models/Offer.js";
import useragent from "useragent"; 

const clickHandler = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { campaign_id } = req.body;

    if (!campaign_id) {
      return res.json({
        status: "failed",
        message: "Campaign ID is required!",
      });
    }

    const checkCampaignExists = await Offer.findOne({
      where: {
        id: campaign_id,
      },
    });

    if (!checkCampaignExists) {
      return res.json({
        status: "failed",
        message: "Campaign not found!",
      });
    }

    if(checkCampaignExists.status === "inactive") {
      return res.json({
        status: "failed",
        message: "Campaign is inactive!",
      });
    }


    const ipAddress =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    const referer = req.get("referer") || "No referer";

    const userAgent = req.headers["user-agent"];
    const agent = useragent.parse(userAgent);
    const browserType = agent.family; 

    const clickHash = uuidv4();

    const click = await Click.create({
      clickHash,
      user_id,
      campaign_id,
      ip_address: ipAddress,
      referer,
      user_agent: userAgent,
      browser_type: browserType,
    });

    let tracking_link = checkCampaignExists.tracking_link;
    tracking_link = tracking_link.replace("{click_id}", clickHash);

    res.json({
      status: "success",
      message: "Click recorded successfully!",
      tracking_link,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error!",
    });
  }
};

export default clickHandler;
