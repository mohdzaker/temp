import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";
import User from "./User.js"; // Import the User model

const Referlist = sequelize.define("Referlist", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Refers to the User model
      key: "id",
    },
  },
  referred_user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Refers to the User model
      key: "id",
    },
  },
  referal_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  referal_amount: {
    type: Sequelize.DECIMAL(10, 2), // Changed to DECIMAL for precision
    allowNull: false,
  },
  refer_commission: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
}, {
  indexes: [
    { fields: ["user_id"] },
    { fields: ["referred_user_id"] },
  ],
});

// Define the association between Referlist and User
Referlist.belongsTo(User, { foreignKey: "referred_user_id", as: "ReferredUser" });

export default Referlist;
