import Click from "../../../models/Click.js";
import EventHistory from "../../../models/EventHistory.js";

Click.hasMany(EventHistory, {
    foreignKey: "clickHash",
    sourceKey: "clickHash",
    as: "eventHistory", 
});

EventHistory.belongsTo(Click, {
    foreignKey: "clickHash",
    targetKey: "clickHash",
});

const getOfferHistory = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { page = 1, limit = 10 } = req.query; 

    const offset = (page - 1) * limit;

    const { rows, count } = await Click.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: EventHistory,
          as: "eventHistory",
          where: { user_id }, 
          required: false, 
        },
      ],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      status: "success",
      data: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalRecords: count,
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: "failed",
      message: "Failed to get offer history",
    });
  }
};

export default getOfferHistory;
