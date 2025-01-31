// Event model
import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Offer from "./Offer.js"; // Import the Offer model

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

export default Event;
