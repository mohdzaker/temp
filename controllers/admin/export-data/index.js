import { Op } from "sequelize";
import EventHistory from "../../../models/EventHistory.js";
import Event from "../../../models/Event.js";
import User from "../../../models/User.js";
import Referlist from "../../../models/Referlist.js";
import Transaction from "../../../models/Transaction.js";
import Config from "../../../models/Config.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";
import Decimal from "decimal.js";

const exportEvent = async (req, res) => {
  try {
    // Fetch event histories from Feb 6, 2025, onwards
    const histories = await EventHistory.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: new Date("2025-02-06") },
      },
      raw: true,
    });

    // Fetch Config for referral percentage
    const config = await Config.findOne({ where: { id: 1 } });
    if (!config) {
      return res.status(500).json({ error: "Config not found" });
    }

    const refer_percentage = config.per_refer;

    // Process refer commission for each event history
    await Promise.all(
      histories.map(async (history) => {
        const event = await Event.findOne({
          where: { id: history.event_id, event_amount: { [Op.gt]: 0 } },
          raw: true,
        });

        if (!event) return;

        const user = await User.findOne({
          where: { id: history.user_id },
        });

        if (!user) return;

        const referrer = user.referedBy;
        const referrerUser = await User.findOne({
          where: { id: referrer },
        });

        if (!referrer || !referrerUser) return;

        // Calculate refer commission
        const getPercentage = (amount, percentage) => {
          return new Decimal(amount).times(new Decimal(percentage)).dividedBy(100).toNumber();
        };

        const referrer_amount = getPercentage(event.event_amount, refer_percentage);

        // Add commission to referrer balance
        referrerUser.balance += referrer_amount;
        await referrerUser.save();

        // Update refer list
        const referedUser = await Referlist.findOne({
          where: {
            user_id: referrerUser.id,
            referred_user_id: history.user_id,
          },
        });

        if (referedUser) {
          referedUser.refer_commission += referrer_amount;
          await referedUser.save();
        }

        // Create transaction for refer commission
        await Transaction.create({
          user_id: referrer,
          amount: referrer_amount,
          description: "Refer Commission",
          trans_type: "credit",
        });

        // Send notification to the referrer
        await sendNotificationToUser(
          "Commission Received",
          "You have received a refer commission!",
          referrer
        );
      })
    );

    return res.status(200).json({ message: "Refer commission sent successfully!" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default exportEvent;
