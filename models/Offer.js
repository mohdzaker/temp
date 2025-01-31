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
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Use lazy import to resolve circular dependency
Offer.associate = (models) => {
  Offer.hasMany(models.Click, { foreignKey: "campaign_id", as: "clicks" });
  Offer.hasMany(models.Event, { foreignKey: "campaign_id", as: "events" }); // ✅ Add this line
};


export default Offer;
