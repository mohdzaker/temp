import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Otp = sequelize.define("Otp", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    otpCode: {
        type: Sequelize.INTEGER(50),
        allowNull: false
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