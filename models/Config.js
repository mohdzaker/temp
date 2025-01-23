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
    },
    invite_link_template: {
        type: Sequelize.STRING,
        allowNull: false
    },
    policy_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    teams_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    banner_link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    banner_onclick_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contact_email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Config;