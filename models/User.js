import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true, 
  },
  mobileNumber: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  profilePic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  referedBy: {
    type: Sequelize.INTEGER,  
    allowNull: true,
    references: {
      model: "Users", 
      key: "id",
    },
  },
  referCode: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isBanned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  balance: {
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
});

export default User;
