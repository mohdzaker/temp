import Decimal from "decimal.js";
import Click from "../../../models/Click.js";
import Config from "../../../models/Config.js";
import Event from "../../../models/Event.js";
import EventHistory from "../../../models/EventHistory.js";
import User from "../../../models/User.js";
import Transaction from "../../../models/Transaction.js";
import Referlist from "../../../models/Referlist.js";
import SecretKey from "../../../models/SecureKey.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

export const togglePostback = async (req, res) => {
  try {
    const { click_id, event, secret_key } = req.query;

    const checkSecretKey = await SecretKey.findOne({
      where: {
        secret_key,
      },
    });

    if (!checkSecretKey) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or expired secret key!",
      });
    }
    if (!click_id) {
      return res.status(400).json({
        status: "failed",
        message: "Click ID is required",
      });
    }

    if (!event) {
      return res.status(400).json({
        status: "failed",
        message: "Event is required",
      });
    }

    const checkClickHash = await Click.findOne({
      where: { clickHash: click_id },
    });

    if (!checkClickHash) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid click ID!",
      });
    }

    if (checkClickHash.status === "completed") {
      return res.status(400).json({
        status: "failed",
        message: "Offer has already been completed!",
      });
    }

    const checkEventExists = await Event.findOne({
      where: {
        campaign_id: checkClickHash.campaign_id,
      },
    });

    if (!checkEventExists) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found in this campaign!",
      });
    }

    if (checkEventExists.status === "inactive") {
      return res.status(400).json({
        status: "failed",
        message: "Event is inactive!",
      });
    }

    const checkEventHistory = await EventHistory.findOne({
      where: {
        clickHash: click_id,
        campaign_id: checkClickHash.campaign_id,
        event_id: checkEventExists.id,
        status: "completed",
      },
    });

    if (checkEventHistory) {
      return res.status(400).json({
        status: "failed",
        message:
          "Offer with this event has already been completed for this user!",
      });
    }

    await EventHistory.update(
      { status: "completed" },
      {
        where: {
          clickHash: click_id,
          campaign_id: checkClickHash.campaign_id,
          event_id: checkEventExists.id,
        },
      }
    );

    const user = await User.findOne({
      where: { id: checkClickHash.user_id },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found!",
      });
    }

    user.balance += checkEventExists.event_amount;
    await user.save();
    await Transaction.create({
      user_id: checkClickHash.user_id,
      amount: checkEventExists.event_amount,
      description: "Event Completion",
      trans_type: "credit",
    });
    const config = await Config.findOne({
      where: { id: 1 },
    });
    const getPercentage = (amount, percentage) => {
      let number = new Decimal(amount);
      let newAmout = new Decimal(number.dividedBy(100)).times(
        new Decimal(percentage)
      );
      return +newAmout;
    };
    const refer_percentage = config.per_refer;
    const referrer_amount = getPercentage(
      checkEventExists.event_amount,
      refer_percentage
    );
    const referrer = user.referedBy;
    const referrerUser = await User.findOne({
      where: { id: referrer },
    });
    if (referrer && referrerUser) {
      referrerUser.balance += referrer_amount;
      await referrerUser.save();
    }
    const referedUser = await Referlist.findOne({
      where: {
        user_id: referrerUser.id,
        referred_user_id: checkClickHash.user_id,
      },
    });

    if (referedUser) {
      referedUser.refer_commission += referedUser + referrer_amount;
      await referedUser.save();
      await sendNotificationToUser(
        "Commission Received",
        "You have received commission!",
        referrer
      );
    }
    await Transaction.create({
      user_id: referrer,
      amount: referrer_amount,
      description: "Refer Commission",
      trans_type: "credit",
    });

    const allEventsInCampaign = await Event.findAll({
      where: { campaign_id: checkClickHash.campaign_id },
      attributes: ["id"],
    });

    const completedEvents = await EventHistory.findAll({
      where: {
        user_id: checkClickHash.user_id,
        campaign_id: checkClickHash.campaign_id,
        status: "completed",
      },
      attributes: ["event_id"],
    });

    const completedEventIds = completedEvents.map((event) => event.event_id);
    const allEventIds = allEventsInCampaign.map((event) => event.id);

    const hasCompletedAllEvents = allEventIds.every((id) =>
      completedEventIds.includes(id)
    );

    if (hasCompletedAllEvents) {
      checkClickHash.status = "completed";
      await checkClickHash.save();
    }
    await sendNotificationToUser(
      "Event Completed",
      "Event completed successfully!",
      checkClickHash.user_id
    );
    return res.status(200).json({
      status: "success",
      message: hasCompletedAllEvents
        ? "Offer completed successfully! All events completed."
        : "Event completed successfully! Remaining events exist.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error toggling postback",
    });
  }
};
