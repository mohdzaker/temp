const handlePostback = async (req, res) => {
  try {
    const { click_id, event } = req.query;

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
      where: { campaign_id: checkClickHash.campaign_id },
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
      },
    });

    if (checkEventHistory) {
      if (checkEventHistory.status === "completed") {
        return res.status(400).json({
          status: "failed",
          message:
            "Offer with this event has already been completed for this user!",
        });
      }

      // Update the existing record instead of creating a new one
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
    } else {
      await EventHistory.create({
        user_id: checkClickHash.user_id,
        clickHash: click_id,
        campaign_id: checkClickHash.campaign_id,
        event_id: checkEventExists.id,
        status: "completed",
      });
    }

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

    const config = await Config.findOne({ where: { id: 1 } });

    const getPercentage = (amount, percentage) => {
      return new Decimal(amount).mul(new Decimal(percentage)).div(100).toNumber();
    };

    const refer_percentage = config.per_refer;
    const referrer_amount = getPercentage(
      checkEventExists.event_amount,
      refer_percentage
    );
    const referrer = user.referedBy;

    if (referrer) {
      const referrerUser = await User.findOne({ where: { id: referrer } });

      if (referrerUser) {
        referrerUser.balance += referrer_amount;
        await referrerUser.save();

        const referedUser = await Referlist.findOne({
          where: {
            user_id: referrerUser.id,
            referred_user_id: user.id,
          },
        });

        if (referedUser) {
          referedUser.refer_commission += referrer_amount;
          await referedUser.save();
        }

        await Transaction.create({
          user_id: referrer,
          amount: referrer_amount,
          description: "Refer Commission",
          trans_type: "credit",
        });
      }
    }

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

    return res.status(200).json({
      status: "success",
      message: hasCompletedAllEvents
        ? "Offer completed successfully! All events completed."
        : "Event completed successfully! Remaining events exist.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while handling the postback",
    });
  }
};

export default handlePostback;
