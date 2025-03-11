import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const PromoCode = sequelize.define('PromoCode',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    per_user: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    total_users: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    total_claimed: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    expires: {
        type: Sequelize.DATE,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default PromoCode;