import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobileNumber: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    profilePic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    referedBy: {
        type: Sequelize.STRING,
        defaultValue: "",
    },
    referCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "user"
    },
    isBanned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}); 

export default User;