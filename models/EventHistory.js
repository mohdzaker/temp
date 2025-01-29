import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Offer from "./Offer.js";  // Ensure Offer is imported
import Click from "./Click.js";

const EventHistory = sequelize.define("EventHistory", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  clickHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  campaign_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Offer,
      key: "id",
    },
  },
  event_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Define associations
EventHistory.associate = (models) => {
  EventHistory.belongsTo(models.Offer, { 
    foreignKey: "campaign_id", 
    as: "campaign" 
  });

  if (models.Click) { // Ensure Click is available
    EventHistory.belongsTo(Click, { foreignKey: "clickHash", targetKey: "clickHash", as: "click" });
  }
};

export default EventHistory;
