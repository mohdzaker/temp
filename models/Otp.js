import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Otp = sequelize.define("Otp", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    mobileNumber: {
        type: Sequelize.BIGINT(200),
        allowNull: false
    },
    otpCode: {
        type: Sequelize.INTEGER(50),
        allowNull: false
    },
    google_token: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    isUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
});

export default Otp;