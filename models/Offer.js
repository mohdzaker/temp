import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

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
  pkg_name : {
    type: Sequelize.STRING,
    default: null
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Offer;
