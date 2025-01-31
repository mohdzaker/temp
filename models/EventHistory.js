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

// Define associations
EventHistory.associate = (models) => {
  EventHistory.belongsTo(models.Offer, {
    foreignKey: "campaign_id",
    as: "offer",
  });
  EventHistory.belongsTo(models.Event, { foreignKey: "event_id", as: "event" }); // ✅ Add this line
  EventHistory.belongsTo(models.Click, {
    foreignKey: "click_id",
    as: "clickById",
  });
  EventHistory.belongsTo(models.Click, {
    foreignKey: "clickHash",
    targetKey: "clickHash",
    as: "clickByHash",
  });

  // Adding association between EventHistory and Event
  if (models.Event) {
    EventHistory.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event",
    });
  }
};

export default EventHistory;
