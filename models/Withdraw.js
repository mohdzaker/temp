import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Withdraw = sequelize.define("Withdraw", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    upi_id:{
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    time:{
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: "processing"
    }
});

export default Withdraw;