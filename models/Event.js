import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Offer from "./Offer.js"; // Import Offer model

const Event = sequelize.define("Event", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  campaign_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Offers",
      key: "id",
    },
  },
  event_title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  event_short_desc: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  event_amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Define associations
Offer.hasMany(Event, { foreignKey: "campaign_id", as: "events" });
Event.belongsTo(Offer, { foreignKey: "campaign_id", as: "offer" });

export default Event;
