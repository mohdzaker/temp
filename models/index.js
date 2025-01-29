import sequelize from "../config/index.js";
import Offer from "./Offer.js";
import Click from "./Click.js";
import Event from "./Event.js";
import EventHistory from "./EventHistory.js";

// Initialize associations
Offer.associate({ Click, EventHistory });
Click.associate({ Offer, EventHistory });
EventHistory.associate({ Offer, Click });

// Export models
const models = { Offer, Click, Event, EventHistory, sequelize };
export default models;
