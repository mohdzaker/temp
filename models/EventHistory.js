// EventHistory model
import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Offer from "./Offer.js";
import Click from "./Click.js";
import Event from "./Event.js";

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

export default EventHistory;
