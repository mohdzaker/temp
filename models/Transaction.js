import sequelize from "../config/index.js";
import { Sequelize } from "sequelize";

const Transaction = sequelize.define('Transaction',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    trans_type: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Transaction;