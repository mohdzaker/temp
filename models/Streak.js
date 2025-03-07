import { DataTypes } from "sequelize";
import sequelize from "../config/index.js";
import User from "./User.js";

const Streak = sequelize.define("Streak", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  streakCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lastCheckIn: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  claimedReward: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Streak;
