import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    mobileNumber: {
        type: Sequelize.BIGINT(200),
        allowNull: false,
    },
    walletBalance: {
        type: Sequelize.INTEGER(50),
        defaultValue: 0
    },
    role: {
        type:Sequelize.STRING,
        defaultValue: "user"
    }
}); 

export default User;