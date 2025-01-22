import Click from "./Click.js";
import EventHistory from "./EventHistory.js";

// Define associations
Click.hasMany(EventHistory, {
  foreignKey: "clickHash",
  sourceKey: "clickHash",
  as: "eventHistory",
});

EventHistory.belongsTo(Click, {
  foreignKey: "clickHash",
  targetKey: "clickHash",
});

export { Click, EventHistory };
