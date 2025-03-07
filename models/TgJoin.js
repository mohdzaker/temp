import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const TgJoin = sequelize.define('TgJoin',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tg_chat_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isJoined: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

export default TgJoin;