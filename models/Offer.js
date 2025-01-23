import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import Click from "./Click.js";

Offer.hasMany(Click, { foreignKey: "campaign_id", as: "clicks" });

const Offer = sequelize.define("Offer", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  campaign_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  short_description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tracking_link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  campaign_logo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Offer;
