import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import EventHistory from "./EventHistory.js"; // Import EventHistory model

const Click = sequelize.define("Click", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  clickHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  campaign_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: "pending",
  },
  ip_address: Sequelize.STRING,
  referer: Sequelize.STRING,
  user_agent: Sequelize.STRING,
  browser_type: Sequelize.STRING,
});

// Define the association
Click.hasMany(EventHistory, {
  foreignKey: "clickHash",
  sourceKey: "clickHash",
  as: "eventHistory",
});

export default Click;
