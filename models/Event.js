import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Event = sequelize.define("Event",{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    event_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    event_title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    event_short_desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    event_amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }, 
});

export default Event;