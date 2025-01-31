import sequelize from "../config/index.js";
import Offer from "./Offer.js";
import Click from "./Click.js";
import Event from "./Event.js";
import EventHistory from "./EventHistory.js";

Offer.hasMany(Click, { foreignKey: "campaign_id", as: "clicks" });
Offer.hasMany(Event, { foreignKey: "campaign_id", as: "events" });

Click.belongsTo(Offer, { foreignKey: "campaign_id", as: "campaign" });
Click.hasMany(EventHistory, { foreignKey: "clickHash", sourceKey: "clickHash", as: "eventHistories" });

Event.belongsTo(Offer, { foreignKey: "campaign_id", as: "offer" });
Event.hasMany(EventHistory, { foreignKey: "event_id", as: "eventHistories" });

EventHistory.belongsTo(Offer, { foreignKey: "campaign_id", as: "offer" });
EventHistory.belongsTo(Event, { foreignKey: "event_id", as: "event" });
EventHistory.belongsTo(Click, { foreignKey: "click_id", as: "clickById" });

const models = { sequelize, Offer, Click, Event, EventHistory };

export default models;
