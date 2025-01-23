import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Offer from "./Offer.js";

Click.belongsTo(Offer, { foreignKey: "campaign_id", as: "campaign" });

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



export default Click;
