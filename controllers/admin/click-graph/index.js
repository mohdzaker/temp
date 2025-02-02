import Click from "../../../models/Click.js";

export const getDatewiseClicks = async (req, res) => {
  try {
    const clicks = await Click.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalClicks"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
    });

    res.json({ status: "success", data: clicks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to get date-wise clicks" });
  }
};

export const getDatewiseCompleted = async (req, res) => {
  try {
    const completedClicks = await Click.findAll({
      where: { status: "completed" },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCompleted"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
    });

    res.json({ status: "success", data: completedClicks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to get date-wise completed clicks",
      });
  }
};
