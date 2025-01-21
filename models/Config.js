import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Config = sequelize.define('Config', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    invite_rules: {
        type: Sequelize.STRING,
        allowNull: false
    },
    withdraw_rules: {
        type: Sequelize.STRING,
        allowNull: false
    },
    per_refer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    minimum_withdraw: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default Config;