import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

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
      model: "User",  // Refers to the User model
      key: "id",
    },
  },
  referred_user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "User",  // Refers to the User model
      key: "id",
    },
  },
  referal_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  referal_amount: {
    type: Sequelize.DECIMAL(10, 2),  // Changed to DECIMAL for precision
    allowNull: false,
  },
}, {
  indexes: [
    { fields: ['user_id'] },
    { fields: ['referred_user_id'] },
  ],
});

export default Referlist;
